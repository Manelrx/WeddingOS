
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface BudgetSummaryDTO {
    totalBudget: number;
    contractedTotal: number;
    availableAmount: number;
    vendorStatus: {
        contracted: number;
        negotiating: number;
        undefined: number;
    };
    nextPayments: {
        id: string;
        vendorName: string;
        vendorId: string;
        amount: number;
        dueDate: string; // ISO Date
        status: string;
<<<<<<< HEAD
        sequenceNumber?: number;
        totalInstallments?: number;
    }[];
}

export async function getBudgetSummary(weddingId: string, token?: string): Promise<BudgetSummaryDTO> {
    const headers: Record<string, string> = {};
    if (token) headers['Cookie'] = `weddingos_token=${token}`;

    const res = await fetch(`${API_URL}/budget/summary/${weddingId}`, {
        cache: 'no-store',
        headers
=======
    }[];
}

export async function getBudgetSummary(weddingId: string): Promise<BudgetSummaryDTO> {
    const res = await fetch(`${API_URL}/budget/summary/${weddingId}`, {
        cache: 'no-store',
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch budget summary: ${res.status} ${res.statusText}`);
    }

    return res.json();
}
