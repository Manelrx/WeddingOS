
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VendorStatus, ProposalStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getSummary(weddingId: string) {
        const wedding = await this.prisma.wedding.findUnique({
            where: { id: weddingId },
            include: {
                vendors: {
                    include: {
                        proposals: {
                            where: { status: ProposalStatus.SUCCESS },
                            include: {
                                analysis: true,
                            },
                            orderBy: { createdAt: 'desc' },
                        },
                    },
                },
            },
        });

        if (!wedding) {
            throw new NotFoundException(`Wedding with ID ${weddingId} not found`);
        }

        // 1. Calculate Total Committed (Sum of closed vendors' accepted proposal value)
        let totalCommitted = 0;

        // We iterate over vendors. If vendor is closed, we look for a successful proposal.
        // We take the latest successful proposal as the active one.
        for (const vendor of wedding.vendors) {
            if (vendor.status === VendorStatus.closed) {
                const activeProposal = vendor.proposals[0]; // Ordered by createdAt desc
                if (activeProposal && activeProposal.analysis && activeProposal.analysis.totalValue) {
                    totalCommitted += Number(activeProposal.analysis.totalValue);
                }
            }
        }

        // 2. Identify Open Decisions (Vendors in analyzing or negotiating)
        const openDecisions = wedding.vendors
            .filter(v =>
                (v.status === VendorStatus.analyzing || v.status === VendorStatus.negotiating)
            )
            .map(v => ({
                id: v.id,
                title: v.serviceType, // Using serviceType as title for now, or name
                description: v.name,
                status: v.status,
            }));

        // 3. Mocked values for missing data
        const totalBudget = 0;
        const totalPaid = 0;

        return {
            weddingDate: wedding.eventDate ? wedding.eventDate.toISOString() : null,
            coupleNames: wedding.title, // Using title as proxy for couple names
            totalBudget,
            totalCommitted,
            totalPaid,
            openDecisions,
        };
    }
}
