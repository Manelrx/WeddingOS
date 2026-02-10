
export interface ProposalAnalysisResult {
    summary: string;

    totalValue?: number;
    paymentTerms?: string;

    items: {
        name: string;
        category?: string;
        status: 'included' | 'not_included' | 'not_informed';
        notes?: string;
    }[];

    /**
     * Risks identified in the proposal.
     * Note: Currently logged but not persisted to DB.
     */
    risks?: string[];

    /**
     * Confidence score of the analysis (0-100).
     * Mapped to ProposalAnalysis.clarityScore in DB.
     */
    confidenceScore?: number;
}
