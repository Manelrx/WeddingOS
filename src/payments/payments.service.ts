import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async createPayment(dto: CreatePaymentDto, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Verify vendor exists & cross-tenant check with user membership
            const vendor = await tx.vendor.findFirst({
                where: {
                    id: dto.vendorId,
                    wedding: { members: { some: { userId } } }
                },
                include: {
                    installments: true,
                    payments: true
                }
            });

            if (!vendor) {
                throw new NotFoundException('Fornecedor não encontrado ou acesso restrito.');
            }

            if (vendor.weddingId !== dto.weddingId) {
                throw new BadRequestException('Vendor does not belong to the specified wedding (tenant mismatch).');
            }

            // 2. Prevent payment if finalContractValue is null
            if (vendor.finalContractValue === null) {
                throw new BadRequestException('Cannot register payment: Vendor does not have a finalized contract value.');
            }

            // 3. Compute totalPaid BEFORE creating payment
            const totalPaid = vendor.payments.reduce((sum, p) => sum + Number(p.amount), 0);

            // 4. Overpayment check
            const contractValue = Number(vendor.finalContractValue);
            const amountToPay = Number(dto.amount);

            if (totalPaid + amountToPay > contractValue) {
                throw new BadRequestException('Overpayment detected. The payment amount exceeds the remaining contract balance.');
            }

            // 5. Installment rules
            const hasInstallments = vendor.installments.length > 0;

            if (dto.installmentId) {
                // If installmentId provided
                const installment = vendor.installments.find(i => i.id === dto.installmentId);

                if (!installment) {
                    throw new BadRequestException('Installment does not belong to the specified vendor.');
                }

                if (installment.paidAt !== null) {
                    throw new BadRequestException('This installment has already been paid.');
                }

                if (Number(installment.amount) !== amountToPay) {
                    throw new BadRequestException('Partial payments for installments are forbidden. The payment amount must match the installment amount exactly.');
                }

            } else {
                // Free amount rule
                if (hasInstallments) {
                    throw new BadRequestException('Free amount payments are not allowed because the vendor has defined installments.');
                }
            }

            // Flow: Create Payment & Link/Update Installment
            const paymentDueDate = dto.installmentId && hasInstallments
                ? vendor.installments.find(i => i.id === dto.installmentId)?.dueDate || new Date(dto.paidAt)
                : new Date(dto.paidAt);

            const payment = await tx.payment.create({
                data: {
                    wedding: { connect: { id: dto.weddingId } },
                    vendor: { connect: { id: dto.vendorId } },
                    installment: dto.installmentId ? { connect: { id: dto.installmentId } } : undefined,
                    amount: amountToPay,
                    dueDate: paymentDueDate,
                    paidAt: new Date(dto.paidAt),
                    paymentMethod: dto.paymentMethod,
                    receiptPath: dto.receiptPath
                }
            });

            if (dto.installmentId) {
                await tx.installment.update({
                    where: { id: dto.installmentId },
                    data: {
                        paidAt: new Date()
                    }
                });
            }

            return payment;
        });
    }
}
