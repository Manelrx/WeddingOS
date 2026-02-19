# Pipeline de IA — WeddingOS

## Visão Geral

O WeddingOS utiliza IA para **extrair dados estruturados** de PDFs de propostas de fornecedores de casamento. O pipeline converte documentos complexos e despadronizados em dados comparáveis.

## Modelo Atual

| Propriedade | Valor |
|---|---|
| **Provider** | Google Gemini |
| **Modelo** | `gemini-3-flash-preview` |
| **SDK** | `@google/genai@^1.0.0` |
| **Temperature** | `1.0` |
| **Thinking** | `ThinkingLevel.LOW` |
| **Output** | JSON estruturado via `responseJsonSchema` |

## Fluxo de Análise

```
1. Upload do PDF → Proposta criada (status: PENDING)
2. Job adicionado à fila Redis (BullMQ)
3. Worker pega o job → status: PROCESSING
4. GeminiProvider:
   a. Lê o PDF do storage (Buffer → Base64)
   b. Envia para Gemini 3 com prompt determinístico
   c. Recebe JSON estruturado
   d. Valida com Zod (ProposalAnalysisSchema)
5. Resultado salvo no banco → status: SUCCESS
6. Frontend detecta via polling (5s)
```

## Arquitetura Multi-Provider

O sistema suporta múltiplos providers de IA via interface `AiProvider`:

```typescript
export interface AiProvider {
  readonly modelName: string;
  analyzeProposal(input: {
    filePath: string;
    proposalId: string;
  }): Promise<ProposalAnalysisResult>;
}
```

### Seleção Dinâmica

O provider ativo é selecionado pela env var `AI_PROVIDER`:

```bash
# .env
AI_PROVIDER=gemini    # Usa GeminiProvider
# AI_PROVIDER=openai  # Usaria OpenAIProvider (futuro)
# AI_PROVIDER=claude  # Usaria ClaudeProvider (futuro)
```

### Como Adicionar um Novo Provider

1. Criar `src/ai/providers/nome.provider.ts` implementando `AiProvider`
2. Registrar no `AiModule` (providers array)
3. Injetar no `AiService` e adicionar o case no switch
4. Configurar `AI_PROVIDER=nome` no `.env`

## Prompt Engineering

O prompt segue regras determinísticas estritas:

- **Nunca assume** dados não explícitos no documento
- Retorna `null` para campos ausentes (sem estimativas)
- Detecta **linguagem contratual vaga** (ex: "a combinar", "sob consulta")
- Categorias controladas: `bebidas`, `alimentação`, `decoração`, `mobiliário`, `música`, `fotografia`, `filmagem`, `cerimonial`, `espaço`, `iluminação`, `outros`
- Normaliza chaves para comparação (ex: "Cerveja Heineken" → `cerveja`)

## Estrutura do Output

```json
{
  "resumo": "string",
  "valorTotal": "number | null",
  "condicoesPagamento": "string | null",
  "pontuacaoClareza": "0-100",
  "pontuacaoConfianca": "0.0-1.0",
  "riscos": [
    {
      "tipo": "financeiro | contratual | operacional",
      "descricao": "string",
      "severidade": "baixa | média | alta"
    }
  ],
  "itens": [
    {
      "textoOriginal": "string",
      "chaveNormalizada": "string (lowercase)",
      "categoria": "enum controlado",
      "incluido": "boolean | null",
      "observacoes": "string | null"
    }
  ],
  "pontosFortes": ["string"],
  "pontosFracos": ["string"],
  "lacunasImportantes": ["string"],
  "diferenciais": ["string"]
}
```

## Validação (Zod)

Todo output da IA é validado com Zod antes de ser persistido:

- `ProposalAnalysisSchema` — Schema principal
- `ProposalRiskSchema` — Riscos tipados
- `ProposalItemSchema` — Itens normalizados

Falhas de validação resultam em `status: FAILED` com `errorMessage` descritivo.
