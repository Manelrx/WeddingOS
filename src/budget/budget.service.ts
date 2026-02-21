import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BudgetSummaryDto } from './dto/budget-summary.dto';
import { VendorStage } from '@prisma/client';

@Injectable()
export class BudgetService {
    constructor(private prisma: PrismaService) { }

    async getBudgetSummary(weddingId: string): Promise<BudgetSummaryDto> {
        const wedding = await this.prisma.wedding.findUnique({
            where: { id: weddingId }
        });

        if (!wedding) {
            throw new NotFoundException('Wedding not found');
        }

        // 1. Financial Summary
        const totalBudget = Number(wedding.totalBudget || 0);

        // Contracted Total: sum(COALESCE(finalContractValue, 0)) where stage = CONTRATADO
        const contractedVendors = await this.prisma.vendor.findMany({
            where: {
                weddingId,
                stage: VendorStage.CONTRATADO
            },
            select: {
                finalContractValue: true
            }
        });

        const contractedTotal = contractedVendors.reduce((sum, v) => sum + Number(v.finalContractValue || 0), 0);
        const availableAmount = Math.max(0, totalBudget - contractedTotal);

        // 2. Vendor Status Counts
        const vendorCounts = await this.prisma.vendor.groupBy({
            by: ['stage'],
            where: { weddingId },
            _count: {
                _all: true
            }
        });

        const statusMap = vendorCounts.reduce((acc, curr) => {
            acc[curr.stage] = curr._count._all;
            return acc;
        }, {} as Record<string, number>);

        const contractedCount = statusMap[VendorStage.CONTRATADO] || 0;
        const negotiatingCount = (statusMap[VendorStage.NEGOCIACAO] || 0) + (statusMap[VendorStage.CONTRATO_EM_ANALISE] || 0);
        const undefinedCount = (statusMap[VendorStage.ORCAMENTO] || 0);

        // 3. Next Payments
        const nextInstallments = await this.prisma.installment.findMany({
            where: {
                vendor: { weddingId },
                paidAt: null
            },
            include: {
                vendor: {
                    select: { name: true, id: true }
                }
            },
            orderBy: { dueDate: 'asc' },
            take: 5
        });

        const nextPayments = nextInstallments.map(inst => {
            const isOverdue = inst.dueDate < new Date();
            return {
                id: inst.id,
                vendorName: inst.vendor.name,
                vendorId: inst.vendor.id,
                amount: Number(inst.amount),
                dueDate: inst.dueDate,
                status: isOverdue ? 'ATRASADO' : 'EM_ABERTO',
                sequenceNumber: inst.sequenceNumber,
                totalInstallments: inst.totalInstallments
            };
        });

        return {
            totalBudget,
            contractedTotal,
            availableAmount,
            vendorStatus: {
                contracted: contractedCount,
                negotiating: negotiatingCount,
                undefined: undefinedCount
            },
            nextPayments
        };
    }
}
