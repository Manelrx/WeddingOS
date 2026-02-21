import { ComparisonMatrix } from "@/app/types/comparison";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getComparison(weddingId: string, serviceType: string, vendorIds?: string[]): Promise<ComparisonMatrix> {
    const url = new URL(`${API_URL}/weddings/${weddingId}/comparisons/${serviceType}`);
    if (vendorIds && vendorIds.length > 0) {
        url.searchParams.append('vendorIds', vendorIds.join(','));
    }

    const res = await fetch(url.toString(), {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch comparison: ${res.status} ${res.statusText}`);
    }

    return res.json();
}
