export interface ProposalRisco {
    tipo: 'financeiro' | 'contratual' | 'operacional';
    descricao: string;
    severidade: 'baixa' | 'média' | 'alta';
}

export interface ProposalItem {
    textoOriginal: string;
    chaveNormalizada: string;
    categoria: string;
    incluido: boolean | null;
    observacoes?: string | null;
}

export interface ProposalAnalysisResult {
    resumo: string;
    valorTotal: number | null;
    condicoesPagamento: string | null;

    /** Pontuação de clareza (0–100): quão claro e completo o documento é. */
    pontuacaoClareza: number;

    /** Pontuação de confiança (0–1): quão confiante a IA está na extração. */
    pontuacaoConfianca: number;

    /** Riscos tipados e classificados. */
    riscos: ProposalRisco[];

    /** Itens normalizados para comparação entre propostas. */
    itens: ProposalItem[];

    /** Pontos fortes destacados (ex: custo-benefício). */
    pontosFortes?: string[];

    /** Pontos fracos ou limitações (ex: pagamento à vista). */
    pontosFracos?: string[];

    /** Lacunas de informação importantes. */
    lacunasImportantes?: string[];

    /** Diferenciais de mercado. */
    diferenciais?: string[];

    /** Destaques para negociação (estratégias). */
    negotiationHighlights?: string[];

    /** Pontos chave do contrato. */
    contractKeyPoints?: string[];

    /** Nome do modelo usado (observabilidade). */
    aiModelUsed?: string;

    /** Tamanho do arquivo processado em bytes (observabilidade). */
    fileSize?: number;
}
