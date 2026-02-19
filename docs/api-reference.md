# Referência da API — WeddingOS

Base URL: `http://localhost:3001` (via Docker port mapping `3001:3000`)

---

## Dashboard

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/dashboard` | Dados agregados para o painel principal |

---

## Weddings (Casamentos)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/weddings` | Lista todos os casamentos |
| `GET` | `/weddings/:id` | Detalhes de um casamento |
| `POST` | `/weddings` | Cria um casamento |
| `PATCH` | `/weddings/:id` | Atualiza um casamento |
| `DELETE` | `/weddings/:id` | Remove um casamento |

---

## Vendors (Fornecedores)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/vendors` | Lista fornecedores (query: `weddingId`) |
| `GET` | `/vendors/:id` | Detalhes do fornecedor (inclui análises) |
| `POST` | `/vendors` | Cria fornecedor (`multipart/form-data` com PDF) |
| `PATCH` | `/vendors/:id` | Atualiza fornecedor |
| `DELETE` | `/vendors/:id` | Remove fornecedor |
| `POST` | `/vendors/:id/analyze` | Dispara análise IA da proposta |
| `GET` | `/vendors/:id/download` | Download do PDF da proposta |

### Criar Fornecedor (Exemplo)
```bash
curl -X POST http://localhost:3001/vendors \
  -F "name=Buffet Premium" \
  -F "category=alimentação" \
  -F "weddingId=uuid-do-casamento" \
  -F "file=@proposta.pdf"
```

### Disparar Análise (Exemplo)
```bash
curl -X POST http://localhost:3001/vendors/{proposalId}/analyze
```

**Resposta:**
```json
{
  "id": "uuid-da-proposta",
  "status": "PROCESSING"
}
```

---

## Comparison (Comparação)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/comparison/:weddingId/:category` | Matriz de comparação por categoria |

---

## Status de Proposta

| Status | Descrição |
|---|---|
| `PENDING` | Proposta criada, aguardando análise |
| `PROCESSING` | Análise em andamento (Worker ativo) |
| `SUCCESS` | Análise concluída com sucesso |
| `FAILED` | Análise falhou (ver `errorMessage`) |

---

## Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `DATABASE_URL` | Connection string PostgreSQL | — |
| `GEMINI_API_KEY` | Chave da API do Google Gemini | — |
| `AI_PROVIDER` | Provider de IA ativo (`gemini`) | `gemini` |
| `QUEUE_ENABLED` | Habilitar fila BullMQ | `true` |
| `WORKER_ENABLED` | Habilitar worker de processamento | `true` |
| `NEXT_PUBLIC_API_URL` | URL da API para o frontend | `http://localhost:3001` |
