
export interface DashboardSummaryDTO {
    weddingDate: string | null;
    coupleNames: string;
    totalBudget: number;
    totalCommitted: number;
    totalPaid: number;
    openDecisions: {
        id: string;
        title: string;
        description: string;
        status: string;
    }[];
}
