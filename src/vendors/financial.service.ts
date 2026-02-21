import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

        const totalContract = Number(vendor.finalContractValue) || null;

        // Compute dynamically
        const totalPaid = vendor.payments.reduce((sum, p) => sum + Number(p.amount), 0);

        let remaining = 0;
        let progress = 0;

        if (totalContract !== null) {
            remaining = totalContract - totalPaid;
            if (totalContract > 0) {
                progress = totalPaid / totalContract;
            }
        }

        const mappedInstallments = vendor.installments.map(inst => {
            let status = 'EM_ABERTO';
            if (inst.paidAt != null) {
                status = 'PAGO';
            } else if (inst.dueDate < new Date()) {
                status = 'ATRASADO';
            }

            return {
                ...inst,
                amount: Number(inst.amount),
                status
            };
        });

        return {
            totalContract: totalContract || 0,
            totalPaid,
            remaining,
            progress: progress,
            installments: mappedInstallments,
            notes: vendor.notes,
            payments: vendor.payments.map(p => ({ ...p, amount: Number(p.amount) }))
        };
    }
}
