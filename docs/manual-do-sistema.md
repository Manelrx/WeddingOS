# Manual Completo e Profundo do Sistema — WeddingOS

Bem-vindo ao manual completo de uso e arquitetura técnica do **WeddingOS**, um sistema de apoio à decisão projetado para casais que estão organizando seu casamento.

O WeddingOS atua como um organizador inteligente e um tradutor de propostas, convertendo PDFs de vários fornecedores (com formatos e tamanhos completamente diferentes) em dados estruturados, claros e comparáveis matematicamente, além de oferecer rígido controle orçamentário.

---

## 🏗️ 1. Visão Geral e Foco do Projeto

**O Foco do Projeto**: Reduzir a carga cognitiva, o cansaço analítico e a ansiedade dos casais durante a jornada de negociações. Este sistema **não é um marketplace** onde fornecedores se cadastram, nem um avaliador público de mercado; é uma ferramenta **privada (Single-Tenant lógico focado no Casal)** com inteligência artificial determinística (Gemini 3 Flash) embarcada, onde a **decisão final é 100% humana**. O sistema apenas traduz o caos (PDFs diversos) em ordem (JSON e matrizes de comparação).

---

## 🤖 2. Guia Detalhado para Agentes de IA e Desenvolvedores

Se você é um desenvolvedor ou um agente de IA ajudando na manutenção deste sistema, aqui estão as regras arquiteturais estritas:

1. **Separação de Preocupações (SoC)**:
   - **Frontend (`web/`)**: Next.js 15 (App Router). Server Components para fetch de dados (comum no Dashboard) e Client Components onde interatividade é exigida (Framer Motion, modais de upload). Estilizado com Tailwind CSS. 
   - **Backend (`src/`)**: NestJS fortemente modularizado. Segue injeção de dependência rigorosa. O código está dividido por domínio de negócio: `ai`, `budget`, `comparison`, `dashboard`, `vendors`, `weddings`, `proposals` e `worker`.
2. **Setup Isolado via Docker Compose**: 
   - O ecossistema backend inteiro (**API NestJS [Porta 3001]**, **PostgreSQL 15** e **Redis**) sobe via `docker-compose up -d` na raiz do projeto. Nenhuma dependência local (exceto Node para o Next.js) é necessária.
3. **Padrão de Qualidade Premium e UI/UX**: 
   - O frontend exige estética *Mobile-First*, com feedbacks visuais assíncronos (spinners, toasts), design premium (glassmorphism/vidro translúcido, gradientes sutis estruturados, animações suaves via Framer Motion). O "feeling" deve transparecer luxo e organização.
4. **Resiliência Assíncrona Total (Event-Driven AI)**: 
   - **Regra de Ouro**: A API HTTP (Controllers) **nunca** bloqueia esperando resposta estendida de LLMs. Toda análise de PDF é delegada para uma fila BullMQ no Redis. A API responde HTTP 201 imediatamente após enfileirar o job.
5. **Tipagem, ORM e Zod**: 
   - Uso de Prisma ORM como fonte de verdade do banco relacional. 
   - `Zod` é usado não só nas rotas, mas primariamente para **forçar o LLM (via SDK Structured Outputs)** a retornar schemas estritos de JSON, eliminando halucinações da IA.
6. **Manejo de Transações e Estado**:
   - Updates que envolvem consistência financeira (em `Payment` ou deleções em cascata no `Vendor`) requerem `$transaction` do Prisma.

---

## 📦 3. Desbravando os Fluxos e Módulos do Sistema (Passo a Passo Técnico)

O sistema é compartimentado por Domínio (Domain-Driven Design). Eis como cada um opera profundamente.

### 3.1. Gestão de Fornecedores e Casamento (CRM do Casal)
Quando o sistema inicia (via semente/seed), um `Wedding` (tenant) é criado. O fluxo de uso começa associando `Vendors` a ele:
- **Fluxo do Usuário**: Acessa "Fornecedores" e abre o Wizard. Um fornecedor nasce no `VendorStage.ORCAMENTO`.
- **Estrutura Técnica**: A entidade `Vendor` possui estágios que vão progredindo: `ORCAMENTO -> NEGOCIACAO -> CONTRATO_EM_ANALISE -> CONTRATADO -> CANCELADO`. Alterar estes estágios impacta diretamente no Total Alocado do orçamento do casamento.

### 3.2. Motor de Inteligência Artificial e Worker Isolation
Este é o coração técnico do projeto. Ao subir um PDF de um fotógrafo, o seguinte fluxo ocorre:

1. **Upload via Request Multipart**: O `ProposalsController` recebe o PDF, salva em `/storage/uploads/` (armazenamento persistido no container local temporariamente) e cria um registro `Proposal` com status `PENDING`.
2. **Enfileiramento**: A função `aiService.queueProposalAnalysis` despacha um Job BullMQ contendo o `proposalId` na fila Redis `proposal-processing`. A resposta HTTP é devolvida ao front imediatamente.
3. **Polling Front-End**: A página de detalhes do fornecedor no frontend do usuário começa um *polling* HTTP (5 em 5s) consultando o status daquela proposta específica.
4. **Worker Processor em Ação (`src/worker/proposal.processor.ts`)**:
   - Um `@Processor` acorda, toma o job e lê o arquivo PDF convertido para base64.
   - Atualiza a base para `PROCESSING` (feedback ao front).
   - O Worker possui **Idempotência**: se ele bater na base relacional e vir que já há um `ProposalAnalysis` para aquele ID, ele pula (skips) o job, evitando gastos em duplicidade de API com o Google Gemini.
5. **Comunicação com o LLM (`AiService`)**:
   - Utilizando o *Google GenAI SDK*, o `provider` despacha o schema rigoroso. A IA extrai Resumo, Valores Totais, Riscos (em JSON), Lacunas, Diferenciais e "Itens".
6. **Transação de Persistência Determinística**: 
   - O JSON não é salvo "solto". O Processor abre um `Prisma.$transaction`. Ele insere metadata na tabela relacional `ProposalAnalysis` e itera a lista de peças da proposta retornada criando linhas individuais para cada `ProposalItem`. Cada item ganha uma *`normalizedKey`* (ex: "cerveja_premium") e *`category`* para uso futuro. O status vira `SUCCESS`.
7. **Reflexo na UI**: No próximo polling, o frontend puxa `SUCCESS` e exibe toda a visão profunda do contrato lido para o casal.

### 3.3. Matriz de Comparação (Comparison Matrix)
Este módulo é usado para comparar fornecedores contratáveis (maçãs com maçãs). Se a noiva tem três propostas de Buffets prontas:

1. **Identificação Polimórfica (`ComparisonService.compare()`)**: A API não restringe strings literais rígidas no front. Se o `serviceType` pedido for "Decoração", a API busca no PostgreSQL onde o nome for 'Decoração', 'Decoracao', 'decoracao', agrupando variações léxicas insensiveis à caixa.
2. **Agregação via Chaves Normalizadas**: Os `ProposalItems` criados pela IA no fluxo passado agora entram em sinergia. O sistema roda todos os itens de Buffet A, B e C. Ele constrói um array de critérios mestre através das `normalizedKey`s mapeados pela IA antes (Ex: `key: "hora_extra"`).
3. **Mapeamento de Lacunas**: O sistema então bate a régua de critérios contra o que cada fornecedor respondeu. O status dos itens nascem como `included`, `not_included` (não faz) ou `not_informed` (o fornecedor omitiu da proposta/contrato).
4. **Meta-Análise (IA Comparando IAs)**: A API do NestJS embala todos os resumos e fraquezas (em arrays em memória) e joga **toda a agregação** de volta para o *Gemini 3 Flash* sob o método `compareProposals`. O prompt pede pra IA dar o veredito geral da comparação, apontar a escolha mais barata, a com maior custo-benefício, e gerar dados pro **"Detector de Cilada"** (onde a IA avisa "O Fornecedor C escondeu a multa de cancelamento").
5. **Tipos de Visualização na Tela**:
   - **Tira-Teima**: Usa client-side manipulation em Next.js para fazer *diff* da tabela e sumir com tudo que as três propostas têm igual. O casal vê apenas as assimetrias.
   - **Lupa**: Abre o JSON profundo item a item.
   - **Filtragem Onde Foco = Alerta Médico**: Usa vermelho intenso alertando perigos.

### 3.4. Motor Financeiro (Budget & Payments)
Integrado no esquema e tela mais recentemente, este modelo bloqueia rombo orçamentário.

- **Orçamento Global (`Wedding.totalBudget`)**: Fica fixo. O sistema soma o total de `estimatedValue` (antes do fechamento) e o `finalContractValue` (no momento em que o `VendorStage` vira `CONTRATADO`) para ditar o que já "sumiu" do orçamento (verba Comprometida).
- **Entidades Físicas (Pagamento no Cash Flow)**: Quando contratado, o sistema cria registros isolados de cronograma.
   - `Installment`: Tabeliões cronológicos (ex. "Entrada 20%").
   - `Payment`: Registros históricos rastreáveis. Podem ter status `PAGO`, `EM_ABERTO`, `ATRASADO`.
   - **Visualizações**: Interface expõe timelines ricas com dados preenchidos progressivamente, e a divisão correta de "Pendente" ou "Extrato", ajudando o casal a não perder as contas em meio à ansiedade.

---

*Arquitetura do Manual profundamente descrita e enraizada nas verificações diretas dos artefatos `/worker` e `/comparison` originais do código de back-end. Feito para documentação avançada e AI on-boarding.*
