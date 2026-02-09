FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl ca-certificates

# Install dependencies only when needed
FROM base AS deps


WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
# Install openssl in builder as well for prisma generate


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
# Ensure schema.prisma is available (COPY . . does this, but being explicit about order matters if we were optimizing layers more)
# Create a dummy .env file for build time validation
RUN echo "DATABASE_URL=file:./dev.db" > .env
RUN npx prisma generate

# Build Next.js
# DATABASE_URL is required for building static pages if they use Prisma
# We use a dummy local file for build time, as real connection isn't needed unless generating static pages from real DB data.
# However, Next.js build might attempt to connect.
ENV DATABASE_URL="file:./dev.db"
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prompts ./prompts

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

RUN npm install -g prisma@5.22.0

# Set up home directory for nextjs user
RUN mkdir -p /home/nextjs && chown nextjs:nodejs /home/nextjs

ENV HOME=/home/nextjs
ENV NPM_CONFIG_CACHE=/home/nextjs/.npm

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Start logic: push DB schema (for sqlite) then start server
# Note: For SQLite in Docker, we typically need a writable volume.
# 'npx prisma db push' might fail if it tries to write to a readonly location or if persistence is tricky.
# We will use an entrypoint script or just run command.
# For MVP simplicity, we run db push at startup.
CMD ["sh", "-c", "prisma db push --skip-generate && node server.js"]
