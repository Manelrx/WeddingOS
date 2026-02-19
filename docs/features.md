# Funcionalidades — WeddingOS

## 1. Dashboard (Home)

A tela principal apresenta um resumo do estado atual do casamento:

- **Contagem de fornecedores** por status (analisando, negociando, confirmado)
- **Resumo financeiro** (valor total, ticket médio)
- **Propostas recentes** com status de análise
- Dados carregados via Server Components (SSR)

---

## 2. Gestão de Fornecedores

### Listagem
- Cards de fornecedores com status, categoria e valor
- Filtros por categoria e status
- Layout responsivo (mobile-first)

### Criação (Wizard)
- Wizard multi-step:
  1. **Informações Básicas:** Nome, categoria, contato
  2. **Detalhes Financeiros:** Preço, condições
  3. **Upload de Proposta:** PDF do fornecedor
- Navegação com transições animadas
- Validação em cada step

### Detalhe do Fornecedor
- Informações completas do fornecedor
- Seção de propostas com ações:
  - **Download** da proposta (PDF)
  - **Analisar com IA** (trigger de análise)
- Resultados da análise:
  - Resumo, valor total, condições de pagamento
  - Pontos fortes e fracos
  - Riscos classificados (financeiro, contratual, operacional)
  - Lacunas e diferenciais
- Status em tempo real (polling a cada 5s)
- Edição e exclusão de fornecedor

---

## 3. Upload e Análise de Propostas

### Upload
- Aceita PDFs via `multipart/form-data`
- Armazena no storage local (`uploads/`)
- Cria registro com status `PENDING`

### Análise com IA
- Processamento assíncrono (Redis + BullMQ)
- Pipeline: PDF → Base64 → Gemini 3 Flash → JSON → Zod Validation → Database
- Resultado salvo em `ProposalAnalysis`
- Status tracking: `PENDING` → `PROCESSING` → `SUCCESS` / `FAILED`
- Retry automático para falhas

### Download
- Endpoint `GET /vendors/:id/download`
- Stream do arquivo PDF diretamente

---

## 4. Comparação de Propostas (Comparison Matrix)

### Conceito
Compara propostas de fornecedores **do mesmo serviço** usando normalização determinística:

- Chaves canônicas (ex: `cerveja`, `dj`, `decoracao`)
- Categorias controladas (11 categorias em PT-BR)
- Critérios normalizados para comparação "maçã com maçã"

### Modos de Visualização
1. **Tira-Teima:** Foca nas diferenças entre propostas
2. **Lupa:** Detalhes item a item de cada proposta
3. **Detector de Cilada:** Alerta sobre itens não informados e riscos

---

## 5. Pipeline de IA (Multi-Provider)

- Interface `AiProvider` extensível
- Provider ativo selecionado via `AI_PROVIDER` no `.env`
- Atualmente: **Gemini 3 Flash** (`gemini-3-flash-preview`)
- Preparado para: OpenAI, Claude (futuro)
- Prompt determinístico com regras estritas (sem suposições)
- Validação Zod de todo output

> 📖 Detalhes completos em [ai-pipeline.md](./ai-pipeline.md)

---

## 6. Processamento Assíncrono

- **BullMQ** para gestão de jobs
- **Redis** como broker de mensagens
- **Worker isolado** para processamento IA
- API nunca bloqueia — sempre responde imediatamente
- Frontend faz polling para acompanhar status

---

## ❌ Ainda Não Implementado

- Autenticação & gestão de usuários
- Gestão financeira avançada (orçamento, pagamentos)
- Controle de lista de convidados
- Integração frontend ↔ backend da Comparison Matrix (atualmente usa mocks)
- Notificações push
