import { z } from 'zod';

// --- Taxonomia controlada de categorias (PT-BR) ---
export const CATEGORIAS_PERMITIDAS = [
    'bebidas',
    'alimentação',
    'decoração',
    'mobiliário',
    'música',
    'fotografia',
    'filmagem',
    'cerimonial',
    'espaço',
    'iluminação',
    'outros',
] as const;

// --- Risk Schema (PT-BR) ---
export const ProposalRiskSchema = z.object({
    tipo: z.enum(['financeiro', 'contratual', 'operacional']),
    descricao: z.string().min(5),
    severidade: z.enum(['baixa', 'média', 'alta']),
});

// --- Item Schema (com normalização PT-BR) ---
export const ProposalItemSchema = z.object({
    textoOriginal: z.string().min(1),
    chaveNormalizada: z.string().min(1).transform(val => val.toLowerCase()),
    categoria: z.enum(CATEGORIAS_PERMITIDAS),
    incluido: z.boolean().nullable(),
    observacoes: z.string().nullable().optional(),
});

// --- Main Analysis Schema (PT-BR) ---
export const ProposalAnalysisSchema = z.object({
    resumo: z.string().min(10),
    valorTotal: z.number().nullable(),
    condicoesPagamento: z.string().nullable(),
    pontuacaoClareza: z.number().int().min(0).max(100),
    pontuacaoConfianca: z.number().min(0).max(1),
    riscos: z.array(ProposalRiskSchema),
    itens: z.array(ProposalItemSchema),
    pontosFortes: z.array(z.string()).optional(),
    pontosFracos: z.array(z.string()).optional(),
    lacunasImportantes: z.array(z.string()).optional(),
    diferenciais: z.array(z.string()).optional(),
    negotiationHighlights: z.array(z.string()).optional().nullable(),
    contractKeyPoints: z.array(z.string()).optional().nullable(),
});

export type ValidatedProposalAnalysis = z.infer<typeof ProposalAnalysisSchema>;
