import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComparisonMatrix, ComparisonCriterion, ComparedProposal, ComparedItem } from './interfaces/comparison-matrix.interface';

@Injectable()
export class ComparisonService {
    constructor(private readonly prisma: PrismaService) { }

    async compare(weddingId: string, serviceType: string): Promise<ComparisonMatrix> {
        // 1. Fetch Proposals
        const proposals = await this.prisma.proposal.findMany({
            where: {
                vendor: {
                    weddingId,
                    serviceType,
                },
                status: 'SUCCESS',
                analysis: {
                    isNot: null,
                },
            },
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
                        included: existingItem.included,
                        notes: existingItem.notes,
                        rawText: existingItem.rawText,
                    };
                } else {
                    // Item not mentioned in this proposal
                    itemsMap[criterion.key] = {
                        included: null,
                        rawText: undefined,
                    };
                }
            }

            return {
                proposalId: proposal.id,
                vendorName: proposal.vendor.name,
                totalValue: analysis.totalValue?.toNumber() ?? null,
                items: itemsMap,
            };
        });

        return {
            weddingId,
            serviceType,
            criteria: sortedCriteria,
            proposals: comparedProposals,
        };
    }
}
