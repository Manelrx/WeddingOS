const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ServiceExpectedBudgetPayload {
    type: string;
    expectedValue: number;
}

export interface SetupWeddingPayload {
    coupleNames: string;
    eventDate?: string;
    guestCount?: number;
    totalBudget: number;
    services?: ServiceExpectedBudgetPayload[];
}

export async function setupWedding(payload: SetupWeddingPayload) {
    const res = await fetch(`${API_URL}/weddings/setup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json();
        } catch {
            errorData = await res.text();
        }
        console.error('Failed to setup wedding:', errorData);
        throw new Error(`Failed to setup wedding: ${res.statusText}`);
    }

    return res.json();
}
