export type VendorStage = "ORCAMENTO" | "NEGOCIACAO" | "CONTRATO_EM_ANALISE" | "CONTRATADO" | "CANCELADO";

export interface VendorSummary {
    id: string;
    weddingId: string;
    name: string;
    category: string;
    stage: VendorStage;
    totalValue: number;
    amountPaid: number;
    proposalCount: number;
    estimatedValue?: number;
    finalContractValue?: number;
    remainingBalance?: number;
}

export interface ProposalAnalysis {
    summary: string;
    resumo?: string;
    clarityScore: number;
    pontuacaoClareza?: number;
    confidenceScore: number;
    pontuacaoConfianca?: number;
    paymentTerms?: string | null;
    condicoesPagamento?: string | null;
    risks: { type?: string; tipo?: string; description?: string; descricao?: string; severidade?: string }[];
    riscos?: { tipo?: string; descricao?: string; severidade?: string }[];
    strengths: string[];
    pontosFortes?: string[];
    weaknesses: string[];
    pontosFracos?: string[];
    gaps: string[];
    lacunasImportantes?: string[];
    diferenciais: string[];
    negotiationHighlights?: string[];
    contractKeyPoints?: string[];
    itens?: {
        textoOriginal: string;
        chaveNormalizada: string;
        categoria: string;
        incluido: boolean | null;
        observacoes?: string | null;
    }[];
    items?: {
        textoOriginal: string;
        chaveNormalizada: string;
        categoria: string;
        incluido: boolean | null;
        observacoes?: string | null;
    }[];
}

export interface Proposal {
    id: string;
    name: string;
    totalValue: number;
    createdAt: string;
    status: string;
    analysis?: ProposalAnalysis | null;
    errorMessage?: string;
}

export interface VendorDetail extends VendorSummary {
    notes: string;
    remainingBalance: number;
    paymentConditions: string;
    proposalValidUntil?: string;
    selectedProposalId?: string;
    proposals: Proposal[];
}
