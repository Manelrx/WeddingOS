import { z } from 'zod';

export const ScopeItemSchema = z.object({
  categoria: z.string(),
  item: z.string(),
  detalhe: z.string(),
  incluso: z.boolean(),
});

export type ScopeItem = z.infer<typeof ScopeItemSchema>;

export const AnalysisResultSchema = z.object({
  fornecedor: z.string(),
  tipo_servico: z.string(),
  valor_total: z.number().nullable(),
  status_proposta: z.enum(["Com Preço", "Orçamento Pendente"]),
  condicoes_pagamento: z.string(),
  mapa_escopo: z.array(ScopeItemSchema),
  pontos_atencao: z.array(z.string()),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export const SupplierStatusSchema = z.enum(["analisando", "negociação", "fechado", "descartado"]);

export const SupplierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  serviceType: z.string().min(1, "Tipo de serviço é obrigatório"),
  status: SupplierStatusSchema.default("analisando"),
  lastProposalDate: z.string().optional(),
});

export type Supplier = z.infer<typeof SupplierSchema>;
