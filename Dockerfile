FROM node:20-alpine

# Install OpenSSL (required for Prisma on Alpine)
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
