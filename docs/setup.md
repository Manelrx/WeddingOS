# Setup de Desenvolvimento — WeddingOS

## Pré-requisitos

- **Docker & Docker Compose** (obrigatório para backend)
- **Node.js 18+** (para frontend)
- **Chave de API do Gemini** (`GEMINI_API_KEY`)

## 1. Configurar Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
DB_USER=weddingos
DB_PASSWORD=weddingos
DB_NAME=weddingos
DATABASE_URL="postgresql://weddingos:weddingos@localhost:5432/weddingos?schema=public"
QUEUE_ENABLED=true
WORKER_ENABLED=true
GEMINI_API_KEY="sua-chave-aqui"
AI_PROVIDER=gemini
```

Crie `web/.env.local` para o frontend:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
```

> ⚠️ **Importante:** Use `127.0.0.1` ao invés de `localhost` para evitar problemas de resolução IPv6 no Node.js.

## 2. Backend (Docker)

```bash
# Subir todos os serviços (API + PostgreSQL + Redis)
docker compose up

# Ou apenas rebuild do backend
docker compose up --build api

# Verificar logs
docker compose logs -f api
```

A API estará acessível em `http://127.0.0.1:3001`.

### Ports

| Serviço | Porta Interna | Porta Externa |
|---|---|---|
| API (NestJS) | 3000 | 3001 |
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | 6379 |

## 3. Migrations (Prisma)

```bash
# ⚠️ SEMPRE rodar no HOST, nunca dentro do Docker
npx prisma migrate dev

# Gerar o Prisma Client
npx prisma generate

# Visualizar o banco
npx prisma studio
```

## 4. Frontend (Next.js)

```bash
cd web
npm install
npm run dev
```

Acesse `http://localhost:3000` (ou a porta indicada pelo Next.js).

## 5. Troubleshooting

### `fetch failed` no Frontend
- Verifique se `NEXT_PUBLIC_API_URL` usa `http://127.0.0.1:3001` (não `localhost`)
- Verifique se o container da API está rodando: `docker compose ps`

### `Cannot find module '@google/genai'`
- O módulo só existe dentro do Docker. No host, rode:
  ```bash
  npm install @google/genai
  ```
  Ou apenas ignore — o lint local mostra erro, mas o Docker compila corretamente.

### Redis `ENOTFOUND`
- Certifique-se de que o Redis está rodando: `docker compose up -d redis`
- Reinicie a API: `docker compose restart api`

### Compilation errors após mudanças em `package.json`
- O Docker usa um volume anônimo para `node_modules`. Após mudar deps:
  ```bash
  docker compose down
  docker compose up --build api
  ```
