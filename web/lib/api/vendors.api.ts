
import { VendorSummary } from '@/types/vendor.types';
import { VendorDetail } from '@/types/vendor.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getVendorsByWedding(weddingId: string): Promise<VendorSummary[]> {
    try {
        const res = await fetch(`${API_URL}/weddings/${weddingId}/vendors`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorBody = await res.text().catch(() => '');
            console.error(`[API Error] getVendorsByWedding: ${res.status} ${errorBody}`);
            throw new Error(`Failed to fetch vendors: ${res.status} ${res.statusText} - ${errorBody}`);
        }

        const data = await res.json();

        // Handle both { vendors: [...] } and raw array response formats
        const vendors = Array.isArray(data) ? data : (data.vendors || []);

        // Map raw DB fields to frontend expected shape if needed
        return vendors.map((v: any) => ({
            id: v.id,
            name: v.name,
            category: v.category || v.serviceType || '',
            stage: v.stage,
            totalValue: v.totalValue || 0,
            amountPaid: v.amountPaid || 0,
            proposalCount: v.proposalCount || 0,
            finalContractValue: v.finalContractValue,
            remainingBalance: v.remainingBalance,
            estimatedValue: v.estimatedValue
        }));
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return [];
    }
}

export async function getVendorById(vendorId: string): Promise<VendorDetail> {
    const res = await fetch(`${API_URL}/vendors/${vendorId}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch vendor details: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export interface CreateVendorPayload {
    name: string;
    serviceType: string;
}

export async function createVendor(weddingId: string, payload: CreateVendorPayload): Promise<{ id: string; name: string; serviceType: string }> {
    const res = await fetch(`${API_URL}/weddings/${weddingId}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Failed to create vendor: ${res.status} ${errorBody}`);
    }

    return res.json();
}

export async function uploadProposal(vendorId: string, file: File): Promise<{ id: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/vendors/${vendorId}/proposals`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Failed to upload proposal: ${res.status} ${errorBody}`);
    }

    return res.json();
}

export interface UpdateVendorPayload {
    name?: string;
    serviceType?: string;
    stage?: string;
    notes?: string;
    estimatedValue?: number;
    proposalValidUntil?: string;
    finalContractValue?: number;
    totalPaid?: number;
}

export async function updateVendor(vendorId: string, payload: UpdateVendorPayload): Promise<any> {
    const res = await fetch(`${API_URL}/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Failed to update vendor: ${res.status} ${errorBody}`);
    }

    return res.json();
}

export async function deleteVendor(vendorId: string): Promise<void> {
    const res = await fetch(`${API_URL}/vendors/${vendorId}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Failed to delete vendor: ${res.status} ${errorBody}`);
    }
}

export async function analyzeProposal(proposalId: string): Promise<{ id: string; status: string }> {
    const res = await fetch(`${API_URL}/vendors/${proposalId}/analyze`, {
        method: 'POST',
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Failed to trigger analysis: ${res.status} ${errorBody}`);
    }

    return res.json();
}
