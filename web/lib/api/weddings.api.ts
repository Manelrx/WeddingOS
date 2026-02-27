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

}

export async function getMyWedding(token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers['Cookie'] = `weddingos_token=${token}`;

    const res = await fetch(`${API_URL}/weddings/find`, {
        cache: 'no-store',
        headers
    });

    if (!res.ok) {
        throw new Error('Failed to fetch wedding context');
    }

    return res.json();
}

export async function updateWeddingBudget(weddingId: string, totalBudget: number): Promise<any> {
    const res = await fetch(`/api/proxy/weddings/${weddingId}/budget`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalBudget }),
    });

    if (!res.ok) {
        throw new Error('Failed to update total budget');
    }

    return res.json();
}
