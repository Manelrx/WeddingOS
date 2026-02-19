export interface ComparisonMatrix {
    weddingId: string;
    serviceType: string;
    criteria: ComparisonCriterion[];
    proposals: ComparedProposal[];
}

export interface ComparisonCriterion {
    key: string;         // Canonical ID (e.g. "som-iluminacao-palco")
    label: string;       // Display text (e.g. "Palco")
    category: string;    // Display category (e.g. "Som & Iluminação")
}

export interface ComparedProposal {
    proposalId: string;
    vendorName: string;
    totalValue: number | null;
    items: Record<string, ComparedItem>; // Keyed by ComparisonCriterion.key
}

export interface ComparedItem {
    status: 'included' | 'not_included' | 'not_informed';
    notes?: string;
    originalName?: string;
}
