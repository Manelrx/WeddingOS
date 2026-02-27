
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface InstallmentDTO {
    id: string;
    amount: number;
    dueDate: string;
    status: 'PAGO' | 'EM_ABERTO' | 'ATRASADO';
    paymentId?: string;
<<<<<<< HEAD
    sequenceNumber?: number;
    totalInstallments?: number;
=======
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
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
<<<<<<< HEAD
    weddingId: string;
    vendorId: string;
    amount: number;
    paidAt: string;
=======
    vendorId: string;
    amount: number;
    dueDate: string;
    paidAt?: string;
    status: 'PAGO' | 'EM_ABERTO' | 'ATRASADO';
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
    paymentMethod?: string;
    receiptPath?: string;
    installmentId?: string;
}

<<<<<<< HEAD
export async function getVendorFinancials(vendorId: string, token?: string): Promise<VendorFinancialDTO> {
    const headers: Record<string, string> = {};
    if (token) headers['Cookie'] = `weddingos_token=${token}`;

    const res = await fetch(`${API_URL}/vendors/${vendorId}/financial`, {
        cache: 'no-store',
        headers
=======
export async function getVendorFinancials(vendorId: string): Promise<VendorFinancialDTO> {
    const res = await fetch(`${API_URL}/vendors/${vendorId}/financial`, {
        cache: 'no-store',
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch vendor financials: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

<<<<<<< HEAD
export async function registerPayment(payload: CreatePaymentPayload): Promise<PaymentDTO> {
    // Uses Next.js Rewrite rule to proxy the request and forward client-side cookies automatically
    const res = await fetch(`/api/proxy/payments`, {
=======
export async function registerPayment(vendorId: string, payload: CreatePaymentPayload): Promise<PaymentDTO> {
    const res = await fetch(`${API_URL}/vendors/${vendorId}/payments`, {
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`Failed to register payment: ${res.status} ${res.statusText}`);
    }

    return res.json();
}
