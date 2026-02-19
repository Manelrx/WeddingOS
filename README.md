# WeddingOS

## 1. Visão Geral
**WeddingOS** é um sistema de apoio à decisão projetado para casais organizando seu casamento.
Seu objetivo principal é atuar como um **organizador inteligente** e um **tradutor de propostas**, convertendo PDFs complexos e despadronizados de fornecedores em dados claros e comparáveis.

**O que ele É:**
- Um centralizador de informações do casamento.
- Uma ferramenta para reduzir ansiedade e facilitar escolhas.
- Um sistema de análise de documentos assistido por IA.

**O que ele NÃO É:**
- Um marketplace de fornecedores.
- Um ranking público ou sistema de avaliações.
- Uma ferramenta que toma decisões pelo casal.

---

## 2. Estado Atual

**Fase:** 📱 Visualização da Decisão (Frontend)

✅ **Implementado:**
- Estrutura base NestJS (Modular) + Docker (API + PostgreSQL + Redis)
- CRUD completo de Weddings & Vendors
- Upload de propostas + análise com IA (Gemini 3 Flash)
- Processamento assíncrono (Redis + BullMQ)
- Comparison Matrix (comparação "maçã com maçã")
- Frontend mobile-first com Server Components
- Dashboard com dados reais do backend
- Wizard de criação de fornecedores
- Download e análise de propostas via modal

❌ **Ainda não implementado:**
- Autenticação & gestão de usuários
- Gestão financeira avançada
- Lista de convidados
- Integração completa frontend ↔ backend da Comparison Matrix

---

## 3. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Linguagem** | TypeScript (Strict) |
| **Frontend** | Next.js 15 (App Router) + TailwindCSS + Framer Motion |
| **Backend** | NestJS (Modular) |
| **Banco** | PostgreSQL 15+ |
| **Fila/Cache** | Redis + BullMQ |
| **IA** | Google Gemini 3 Flash (`@google/genai`) |
| **ORM** | Prisma |
| **Infra** | Docker & Docker Compose |

---

## 4. Pipeline de IA

O sistema utiliza **Gemini 3 Flash** (`gemini-3-flash-preview`) para extração determinística de dados de propostas.

- **SDK:** `@google/genai@^1.0.0` (nova SDK oficial do Google)
- **Output:** JSON estruturado com validação Zod
- **Thinking:** `ThinkingLevel.LOW` para extração rápida
- **Prompt:** Regras estritas — nunca assume, retorna `null` para ausentes

### Multi-Provider

Arquitetura preparada para múltiplos providers via `AI_PROVIDER` env var:

```bash
AI_PROVIDER=gemini    # Ativo
# AI_PROVIDER=openai  # Futuro
# AI_PROVIDER=claude  # Futuro
```

Para adicionar um novo provider:
1. Criar `src/ai/providers/nome.provider.ts` implementando `AiProvider`
2. Registrar no `AiModule`
3. Adicionar case no `AiService`
4. Mudar `AI_PROVIDER` no `.env`

> 📖 Detalhes completos em [`docs/ai-pipeline.md`](./docs/ai-pipeline.md)

---

## 5. Como Rodar

### Pré-requisitos
- Docker & Docker Compose
- Node.js 18+
- `GEMINI_API_KEY` no `.env`

### Quick Start

```bash
# Backend (API + PostgreSQL + Redis)
docker compose up

# Frontend (em outro terminal)
cd web && npm install && npm run dev
```

- **API:** `http://127.0.0.1:3001`
- **Frontend:** `http://localhost:3000`

> 📖 Setup completo em [`docs/setup.md`](./docs/setup.md)

---

## 6. Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/architecture.md`](./docs/architecture.md) | Arquitetura, módulos, princípios |
| [`docs/features.md`](./docs/features.md) | Todas as funcionalidades detalhadas |
| [`docs/ai-pipeline.md`](./docs/ai-pipeline.md) | Pipeline de IA, prompt, multi-provider |
| [`docs/api-reference.md`](./docs/api-reference.md) | Endpoints, exemplos, env vars |
| [`docs/setup.md`](./docs/setup.md) | Setup local, migrations, troubleshooting |

---

## 7. Próximas Fases

1. ✅ Módulo de Weddings & Vendors
2. ✅ Upload de Propostas & Fila
3. ✅ Integração IA (Gemini 3 Flash)
4. ✅ Modelo de Comparação
5. ✅ Frontend de Apoio à Decisão
6. ⬜ Autenticação & integração completa
7. ⬜ Gestão financeira & lista de convidados

---

> 📝 **Atualizado em:** Fevereiro 2026 — Gemini 3 Flash + Multi-Provider Architecture.
