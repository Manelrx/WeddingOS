import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class FinancialService {
    constructor(private prisma: PrismaService) { }

    async getVendorFinancials(vendorId: string) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id: vendorId },
            include: {
                installments: {
                    orderBy: { dueDate: 'asc' }
                },
                payments: {
                    orderBy: { paidAt: 'desc' }
                }
            }
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        const totalContract = Number(vendor.finalContractValue || 0);
        const totalPaid = Number(vendor.totalPaid || 0);
        const remaining = Number(vendor.remainingBalance || 0);

        // Calculate progress (0-100)
        const progress = totalContract > 0 ? (totalPaid / totalContract) * 100 : 0;

        return {
            totalContract,
            totalPaid,
            remaining,
            progress: Math.min(progress, 100), // Cap at 100 just in case
            installments: vendor.installments,
            notes: vendor.notes,
            // Also return recent payments if needed UI-side
            payments: vendor.payments
        };
    }

    async registerPayment(data: CreatePaymentDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Create Payment
            const payment = await tx.payment.create({
                data: {
                    vendorId: data.vendorId,
                    amount: data.amount,
                    dueDate: data.dueDate,
                    paidAt: data.paidAt,
                    status: data.status,
                    paymentMethod: data.paymentMethod,
                    receiptPath: data.receiptPath
                }
            });

            // 2. Link/Update Installment if provided
            if (data.installmentId) {
                await tx.installment.update({
                    where: { id: data.installmentId },
                    data: {
                        status: PaymentStatus.PAGO,
                        paymentId: payment.id
                    }
                });
            }

            // 3. Update Vendor Totals
            // Re-fetch vendor to ensure up-to-date values before calc (or just increment)
            const vendor = await tx.vendor.findUnique({ where: { id: data.vendorId } });
            if (!vendor) throw new NotFoundException('Vendor not found');

            const newTotalPaid = Number(vendor.totalPaid || 0) + Number(data.amount);
            const newRemaining = Number(vendor.finalContractValue || 0) - newTotalPaid;

            await tx.vendor.update({
                where: { id: data.vendorId },
                data: {
                    totalPaid: newTotalPaid,
                    remainingBalance: newRemaining
                }
            });

            return payment;
        });
    }
}
