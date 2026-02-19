export interface ComparisonMatrix {
    weddingId: string;
    serviceType: string;
    criteria: ComparisonCriterion[];
    proposals: ComparedProposal[];
}

export interface ComparisonCriterion {
    key: string;         // AI-generated normalizedKey (e.g. "whisky", "dj", "buffet")
    label: string;       // Display text (first rawText found for this key)
    category: string;    // Display category (e.g. "Bebidas", "Entretenimento")
}

export interface ComparedProposal {
    proposalId: string;
    vendorName: string;
    totalValue: number | null;
    items: Record<string, ComparedItem>; // Keyed by ComparisonCriterion.key
}

export interface ComparedItem {
    included: boolean | null; // true=included, false=excluded, null=not mentioned
    notes?: string;
    rawText?: string;         // Original text from the proposal
}
