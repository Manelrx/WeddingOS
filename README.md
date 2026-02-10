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

## 2. Estado Atual do Projeto
**Fase:** 🧠 Integração com IA & Processamento Assíncrono

O projeto avançou da fundação para a implementação da inteligência central. O sistema já é capaz de ler e interpretar propostas automaticamente via IA.

✅ **Implementado:**
- Estrutura base do projeto NestJS (Modular).
- Configuração do Docker (API + PostgreSQL + **Redis**).
- Modelagem completa do banco de dados (Prisma Schema).
- **Módulo Weddings & Vendors (CRUD Completo).**
- **Módulo Proposals (Upload + Análise):**
  - Upload via `multipart/form-data`.
  - Persistência em storage local.
  - Validação de tipos e tamanhos.
- **Arquitetura Assíncrona (Redis + BullMQ):**
  - Worker isolado para processamento pesado.
  - Separação total entre API (recebimento) e Worker (execução).
- **Integração com IA (Gemini 3):**
  - **Camada de IA plugável (Multi-Provider Architecture).**
  - Provider oficial do Google Gemini implementado.
  - Extração automática de dados (Resumo, Valores, Itens, Condições de Pagamento).
  - Mapeamento de `ProposalAnalysis` e `ProposalItem`.
  - Tratamento de status (PENDING → SUCCESS/ERROR) e erros de API.

❌ **Ainda NÃO Implementado:**
- Comparação inteligente entre propostas (Side-by-side).
- Visualização de dados no Frontend.
- Autenticação & Gestão de usuários.
- Gestão financeira avançada.
- Controle de lista de convidados.

---

## 3. Stack Tecnológica
A escolha tecnológica prioriza robustez, tipagem estática e facilidade de manutenção.

- **Linguagem:** TypeScript (Strict mode).
- **Backend:** Node.js + NestJS (Arquitetura modular).
- **Banco de Dados:** PostgreSQL 15+ (Relacional e confiável).
- **Fila/Cache:** Redis + BullMQ (Gerenciamento de Jobs).
- **IA:** Google Gemini (via `GoogleGenerativeAI`).
- **ORM:** Prisma (Type-safety e migrations declarativas).
- **Infraestrutura Local:** Docker & Docker Compose.

---

## 4. Arquitetura (Alto Nível)
O sistema opera com uma arquitetura orientada a eventos, garantindo que o processamento pesado da IA não impacte a responsividade da API.

**Princípios Chave:**
1. **Desacoplamento:** A API **nunCA** chama a IA diretamente. Ela apenas enfileira jobs.
2. **Isolamento:** A IA roda exclusivamente no **Worker**.
3. **Abstração:** O sistema não depende do Gemini especificamente. Existe uma camada de abstração (`AiProvider`) que permite plugar outras IAs (GPT-4, Claude) no futuro sem refatorar o domínio.
4. **Domínio Soberano:** O formato dos dados (`ProposalAnalysisResult`) é definido pelo WeddingOS. A IA deve se adaptar a ele, e não o contrário.

**Fluxo de Dados Completo:**
`Cliente (Upload)` → `API` → `Storage` + `Fila (Redis)` → `Worker` → `AiService` → `Gemini Provider` → `Banco (Analysis + Items)`

---

## 5. Modelagem de Domínio (Resumo)

### Wedding (Casamento)
A entidade raiz. Representa o evento/casal (Tenant).

### Vendor (Fornecedor)
Um prestador de serviço (ex: Buffet, Fotografia). Possui Status (`analyzing`, `negotiating`, etc).

### Proposal (Proposta - Documento)
Representa o arquivo PDF.
- **Ciclo de Vida:** Criação (PENDING) → Enfileiramento → Processamento (Worker) → Resultado (SUCCESS/ERROR).
- O status é atualizado automaticamente pelo Worker após tentativa de análise.

### ProposalAnalysis (Análise - Dados)
O cérebro do sistema. Dados estruturados extraídos pela IA.
- **Criação Automática:** Gerada pelo Worker se a análise for bem sucedida.
- **Conteúdo:** Resumo, Valor Total, Condições, Clarity Score (Confiança da IA).
- **Nota:** Riscos (`risks`) são identificados e logados, mas ainda não persistidos no banco nesta fase.

### ProposalItem (Itens da Proposta)
Detalhes normalizados (ex: "Jantar", "Bebidas").
- Classificados automaticamente como `included`, `not_included` ou `not_informed`.

---

## 6. Banco de Dados e Migrations
Utilizamos o **Prisma Migrate**.

⚠️ **REGRA CRÍTICA:** Migrations devem ser geradas na máquina host (`npx prisma migrate dev`), nunca dentro do Docker, para garantir o versionamento no Git.

---

## 7. Como Rodar Localmente

### Pré-requisitos
- Docker & Docker Compose.
- Chave de API do Gemini (`GEMINI_API_KEY`) no `.env`.

### Passo a Passo
1. **Configurar Ambiente:**
   Crie um arquivo `.env` com:
   ```env
   DATABASE_URL="postgresql://weddingos:weddingos@localhost:5432/weddingos?schema=public"
   QUEUE_ENABLED=true
   WORKER_ENABLED=true
   REDIS_HOST=localhost
   REDIS_PORT=6379
   GEMINI_API_KEY="sua-chave-aqui"
   ```

2. **Subir Infraestrutura:**
   ```bash
   docker compose up
   ```

3. **Testar Upload:**
   Faça um POST para `http://localhost:3000/proposals/upload` com um arquivo PDF. O log do terminal mostrará o processamento do Worker e a resposta da IA.

---

## 8. Próximas Fases Planejadas

1.  ✅ **Módulo de Weddings & Vendors.**
2.  ✅ **Upload de Propostas & Fila.**
3.  ✅ **Integração IA (Gemini 3):**
    - Setup da arquitetura Multi-IA.
    - Implementação do Worker de análise.
    - Extração de dados estruturados.
4.  **Refinamento & Comparação (PRÓXIMO PASSO):**
    - Melhoria na qualidade do prompt (Prompt Engineering avançado).
    - funcionalidade de comparação "Maçã com Maçã" entre propostas.
    - Persistência de riscos.
5.  **Frontend:** Interface visual para decisão do casal.
6.  **Gestão Financeira:** Controle de pagamentos e orçamentos.

---

> 📝 **Nota de Manutenção:** Este README reflete o estado do sistema após a integração da IA Gemini. Qualquer nova funcionalidade deve atualizar este documento.
