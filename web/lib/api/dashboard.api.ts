
import { DashboardSummaryDTO } from "@/types/dashboard.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getDashboardSummary(weddingId: string): Promise<DashboardSummaryDTO> {
    const res = await fetch(`${API_URL}/dashboard/summary/${weddingId}`, {
        cache: 'no-store', // Always fetch fresh data as requested
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch dashboard summary: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Ensure data shape matches somewhat, or at least validate basic fields if desired.
    // For now, we trust the backend and TypeScript casting.
    return data as DashboardSummaryDTO;
}
