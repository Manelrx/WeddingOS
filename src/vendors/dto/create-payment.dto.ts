
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
    vendorId: string;
    amount: number;
    dueDate: Date;
    paidAt?: Date;
    status: PaymentStatus;
    paymentMethod?: PaymentMethod;
    receiptPath?: string;
    installmentId?: string; // Optional: linkage to existing installment
}
