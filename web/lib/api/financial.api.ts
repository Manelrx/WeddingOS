
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface InstallmentDTO {
    id: string;
    amount: number;
    dueDate: string;
    status: 'PAGO' | 'EM_ABERTO' | 'ATRASADO';
    paymentId?: string;
    sequenceNumber?: number;
    totalInstallments?: number;
}

export interface PaymentDTO {
    id: string;
    amount: number;
    paidAt: string;
    method: string;
}

export interface VendorFinancialDTO {
    totalContract: number;
    totalPaid: number;
    remaining: number;
    progress: number;
    notes?: string;
    installments: InstallmentDTO[];
    payments: PaymentDTO[];
}

export interface CreatePaymentPayload {
    weddingId: string;
    vendorId: string;
    amount: number;
    paidAt: string;
    paymentMethod?: string;
    receiptPath?: string;
    installmentId?: string;
}

export async function getVendorFinancials(vendorId: string): Promise<VendorFinancialDTO> {
    const res = await fetch(`${API_URL}/vendors/${vendorId}/financial`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch vendor financials: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function registerPayment(payload: CreatePaymentPayload): Promise<PaymentDTO> {
    const res = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`Failed to register payment: ${res.status} ${res.statusText}`);
    }

    return res.json();
}
