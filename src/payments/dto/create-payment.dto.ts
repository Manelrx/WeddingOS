import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
    weddingId: string;
    vendorId: string;
    installmentId?: string;
    amount: number;
    paidAt: string | Date; // Frontend usually sends ISO string
    paymentMethod?: PaymentMethod;
    receiptPath?: string;
}
