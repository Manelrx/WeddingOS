# WeddingOS Frontend

Este projeto é a interface mobile-first para o WeddingOS, focada na experiência de decisão dos noivos.

## Funcionalidades
- **Seleção de Serviço:** Escolha entre Buffet, Foto, Decoração.
- **Comparação de Propostas:**
  - **Tira-Teima:** Foca nas diferenças entre fornecedores.
  - **Lupa:** Detalhamento completo item a item.
  - **Detector de Cilada:** Alerta sobre itens não informados ou não inclusos.

## Tecnologias
- Next.js 14+ (App Router)
- TailwindCSS
- Lucide Icons
- Framer Motion

## Como rodar
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse `http://localhost:3000`.

## Estrutura
- `/app`: Páginas e Layouts (Next.js App Router).
- `/components`: Componentes reutilizáveis (UI) e de negócio (Comparison).
- `/app/lib`: Mock de dados (simulando backend).
