# 🤖 Guia de Desenvolvimento para Agentes de IA (AI Developer Guide)

Este documento foi projetado especificamente para ser lido por **IAs, LLMs, Copilots e Agentes Autônomos** (como você) que estão trabalhando no código-fonte do **WeddingOS**. 

Ao analisar o repositório, use este guia como sua constituição arquitetural.

---

## 🧭 1. Entendendo o Domínio do Problema

O WeddingOS **NÃO É UM MARKETPLACE**. Não tente implementar fluxos de "Login de Fornecedores", "Bidding (Leilão)" ou "Avaliações Públicas". 

O sistema é um **CRM Particular (Single-Tenant lógico)** para um casal, projetado para reduzir a carga cognitiva na escolha de fornecedores.
O problema central foca em **Interoperabilidade de Dados**: Fornecedores mandam orçamentos/contratos em PDFs caóticos. O sistema os engole, lê (com Gemini), fatora em JSONs com dezenas de propriedades determinísticas e os compara matematicamente.

---

## 🏗️ 2. Topologia do Monorepo

O projeto está dividido fortemente em duas áreas não-acopladas fisicamente, comunicando-se via REST:

- `/web`: **Frontend**
  - Next.js 15 com App Router.
  - Server Components por padrão. Client Components (`"use client"`) restritos às folhas da árvore (onde há hooks do React ou event listeners).
  - Componentes estéticos baseados em Tailwind e Framer Motion. 

- `/src`: **Backend NestJS**
  - Padrão MVC estrito, injeção de dependências pesadas.
  - O banco de dados relacional (PostgreSQL 15+) é manipulado exclusivamente pelo Prisma (`/prisma`).

---

## ⚠️ 3. Leis Imutáveis de Arquitetura (MANDATÓRIO PARA IAs)

Se você vai escrever código para a API ou Frontend, siga estritamente estas diretrizes:

### Lei I: Event-Driven AI (Não Bloqueie a API)
Jamais adicione uma chamada de rede para o Google GenAI / OpenAI dentro de um arquivo `.controller.ts`. 
O usuário não pode esperar 15 segundos numa requisição HTTP. 
Toda análise de PDF é assíncrona. O Controller injeta o job em uma fila BullMQ no Redis. O `/src/worker/proposal.processor.ts` apanha o arquivo, o processa e escreve no banco. O front faz *polling* desse status.

### Lei II: Zod é a Lei (Structured Outputs)
Como o projeto tira dados de PDFs desestruturados, LLMs alucinam. Para combater isso:
- Na `/src/ai/providers`, o prompt *SEMPRE* exige `responseSchema` validado com Zod.
- Se o LLM não encontrar uma informação (ex: Contrato não diz o preço da hora-extra), você deve instruir o LLM a retornar `null`, e **NUNCA** um valor chutado ou um "-".

### Lei III: Transações Prisma
O sistema mexe com *Budget* (Orçamento). A conversão de um Fornecedor (`Vendor`) do status `NEGOCIACAO` para `CONTRATADO` causa efeitos colaterais severos (cria `Payments`, impacta o Dashboard). 
Qualquer edição deste tipo exige envolver o código num `this.prisma.$transaction(async (tx) => { ... })`. Se o commit final falhar, a tela não pode mostrar o contrato como assinado.

### Lei IV: Estética e UX (Para o Frontend)
Não crie tabelas HTML cinzas e quadradas. O produto deve transmitir a sensação de organização e calma (casamento dá ansiedade).
Use *Glassmorphism* (ex: `bg-white/30 backdrop-blur-md`), gradientes radiais brandos, botões com `hover:scale-105 transition-all` e liste os dados com animações em cascata no Framer Motion (ex: `<motion.div initial={{ opacity: 0, y: 10 }}>`).

---

## 🛢️ 4. Subindo o Ambiente (Instrução Humana x IA)

Se você, IA, precisar rodar bash commands para verificar uma funcionalidade:
1. O Docker lida com o backend. `docker compose up -d` ligará o PostgreSQL (porta 5432), Redis (porta 6379) e o NestJS API (porta 3001).
2. O Frontend tem que ser buildado localmente (`cd web && npm run dev` em 3000).
3. Se gerar comandos pro usuário, separe-os perfeitamente.

---

> Lembre-se, agente: A decisão final é **sempre humana**. O software aponta os buracos do contrato (Detector de Ciladas), mas o Botão "Contratar" tem que ser explícito e orgânico. Seu objetivo no código é organizar e apresentar, não agir de forma autônoma apagando tabelas ou escolhendo fornecedores aleatoriamente pela IA.
