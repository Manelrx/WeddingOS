import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComparisonMatrix, ComparisonCriterion, ComparedProposal, ComparedItem } from './interfaces/comparison-matrix.interface';

@Injectable()
export class ComparisonService {
    constructor(private readonly prisma: PrismaService) { }

    async compare(weddingId: string, serviceType: string, vendorIds?: string[]): Promise<ComparisonMatrix> {
        // 1. Fetch Proposals
        const prismaWhere: any = {
            vendor: {
                weddingId,
                serviceType,
            },
            status: 'SUCCESS',
            analysis: {
                isNot: null,
            },
        };

        if (vendorIds && vendorIds.length > 0) {
            prismaWhere.vendor.id = { in: vendorIds };
        }

        const proposals = await this.prisma.proposal.findMany({
            where: prismaWhere,
            include: {
                vendor: true,
                analysis: {
                    include: {
                        proposalItems: true,
                    },
                },
            },
        });

        if (!proposals.length) {
            return {
                weddingId,
                serviceType,
                criteria: [],
                proposals: [],
            };
        }

        // 2. Build Criteria Map using AI-generated normalizedKey
        const criteriaMap = new Map<string, ComparisonCriterion>();

        for (const proposal of proposals) {
            if (!proposal.analysis || !proposal.analysis.proposalItems) continue;

            for (const item of proposal.analysis.proposalItems) {
                // Use the AI-generated normalizedKey directly
                const key = item.normalizedKey;

                if (!criteriaMap.has(key)) {
                    criteriaMap.set(key, {
                        key,
                        label: item.rawText,   // Use the first rawText found as the display label
                        category: item.category,
                    });
                }
            }
        }

        // 3. Sort Criteria by Category then Label
        const sortedCriteria = Array.from(criteriaMap.values()).sort((a, b) => {
            const catCompare = a.category.localeCompare(b.category);
            if (catCompare !== 0) return catCompare;
            return a.label.localeCompare(b.label);
        });

        // 4. Map Proposals
        const comparedProposals: ComparedProposal[] = proposals.map(proposal => {
            const analysis = proposal.analysis!;
            const itemsMap: Record<string, ComparedItem> = {};

            // Index proposal items by normalizedKey
            const proposalItemsByKey = new Map<string, any>();
            for (const item of analysis.proposalItems) {
                proposalItemsByKey.set(item.normalizedKey, item);
            }

            // For every global criterion, check if this proposal has it
            for (const criterion of sortedCriteria) {
                const existingItem = proposalItemsByKey.get(criterion.key);

                if (existingItem) {
                    itemsMap[criterion.key] = {
                        status: existingItem.included === true ? 'included' : (existingItem.included === false ? 'not_included' : 'not_informed'),
                        notes: existingItem.notes || undefined,
                        originalName: existingItem.rawText,
                    };
                } else {
                    // Item not mentioned in this proposal
                    itemsMap[criterion.key] = {
                        status: 'not_informed',
                    };
                }
            }

            return {
                proposalId: proposal.id,
                vendorName: proposal.vendor.name,
                totalValue: analysis.totalValue ? Number(analysis.totalValue) : null,
                items: itemsMap,
            };
        });

        return {
            weddingId,
            serviceType,
            criteria: sortedCriteria,
            proposals: comparedProposals,
            aiAnalysis: {
                summary: `Comparação de ${proposals.length} propostas de ${serviceType}.`,
                highlights: [
                    `O fornecedor ${comparedProposals[0]?.vendorName} parece ter a proposta mais clara.`,
                    `Fique atento a itens não informados em ${proposals.length > 1 ? 'alguns fornecedores' : 'esta proposta'}.`
                ]
            }
        };
    }
}
