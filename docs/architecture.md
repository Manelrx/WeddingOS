# Arquitetura do WeddingOS

## Visão Geral

O WeddingOS opera com uma arquitetura **orientada a eventos**, garantindo que o processamento pesado da IA não impacte a responsividade da API.

```
Cliente (Upload) → API → Storage + Fila (Redis) → Worker (IA) → Banco (Dados Estruturados)
                                                                        ↓
                                                              Comparison Matrix
                                                                        ↓
                                                              UX da Decisão
                                                                        ↓
                                                                Frontend → Decisão Humana
```

## Stack Tecnológica

| Camada | Tecnologia | Motivo |
|---|---|---|
| **Linguagem** | TypeScript (Strict) | Tipagem estática ponta a ponta |
| **Frontend** | Next.js 15 (App Router) | SSR, Server Components, routing |
| **Styling** | TailwindCSS + Framer Motion | Velocity + animações premium |
| **Backend** | NestJS (Modular) | Injeção de dependência, modular |
| **Banco** | PostgreSQL 15+ | Relacional, confiável |
| **Fila/Cache** | Redis + BullMQ | Jobs assíncronos |
| **IA** | Google Gemini 3 Flash (`@google/genai`) | Extração de PDFs |
| **ORM** | Prisma | Type-safety, migrations |
| **Infra Local** | Docker & Docker Compose | Reprodutibilidade |

## Módulos do Backend

```
src/
├── ai/                    # Pipeline de IA (providers, schemas, interfaces)
│   ├── providers/         # GeminiProvider (extensível para outros)
│   ├── interfaces/        # AiProvider interface, ProposalAnalysisResult
│   └── schemas/           # Zod schemas para validação
├── comparison/            # Comparison Matrix entre propostas
├── dashboard/             # Dados agregados para home
├── proposals/             # Upload, análise, download de propostas
├── queue/                 # Configuração do BullMQ
├── storage/               # Abstração de storage (local/cloud)
├── vendors/               # CRUD de fornecedores
├── weddings/              # CRUD de casamentos (tenant)
└── worker/                # Worker isolado para processamento IA
```

## Frontend (Next.js)

```
web/
├── app/
│   ├── page.tsx           # Dashboard principal
│   ├── vendors/           # Páginas de fornecedores
│   │   ├── page.tsx       # Listagem
│   │   ├── new/           # Wizard de criação
│   │   └── [id]/          # Detalhe do fornecedor
│   └── comparison/        # Telas de comparação
├── components/            # Componentes React reutilizáveis
├── lib/                   # API clients, utilities
└── types/                 # TypeScript type definitions
```

## Princípios Arquiteturais

1. **Desacoplamento:** A API nunca chama a IA diretamente. Tudo passa pela fila.
2. **Isolamento:** A IA roda exclusivamente no Worker.
3. **Multi-Provider:** A interface `AiProvider` permite trocar de modelo sem alterar lógica de negócio.
4. **Decisão Humana:** O frontend **apresenta e organiza** informação. Nunca decide pelo casal.
5. **Server Components:** Dados são carregados server-side via RSC quando possível.
