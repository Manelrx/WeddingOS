import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { ComparisonMatrix, ComparisonCriterion, ComparedProposal, ComparedItem } from './interfaces/comparison-matrix.interface';
import { ProposalAnalysisResult } from '../ai/interfaces/proposal-analysis-result.interface';

@Injectable()
export class ComparisonService {
    private readonly logger = new Logger(ComparisonService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly aiService: AiService,
    ) { }

    async compare(weddingId: string, serviceType: string, vendorIds?: string[]): Promise<ComparisonMatrix> {
        this.logger.log(`Starting comparison for weddingId: ${weddingId}, serviceType: ${serviceType}, vendorIds: ${vendorIds?.join(',')}`);

        // Multi-term mapping for common variations
        let categories: string[] = [serviceType];
        const normalized = serviceType.toLowerCase();
        if (normalized === 'decoracao' || normalized === 'decoração') categories.push('Decoração', 'Decoracao');
        if (normalized === 'musica' || normalized === 'música') categories.push('Música', 'Musica');
        if (normalized === 'espaco' || normalized === 'espaço' || normalized === 'local') categories.push('Espaço', 'local', 'Local', 'Local da cerimônia', 'espaço');
        if (normalized === 'buffet') categories.push('Buffet');
        if (normalized === 'fotografia') categories.push('Fotografia');

        // 1. Fetch Proposals
        const prismaWhere: any = {
            vendor: {
                weddingId,
                serviceType: {
                    in: categories,
                    mode: 'insensitive',
                },
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

        this.logger.log(`Found ${proposals.length} proposals for comparison`);

        if (!proposals.length) {
            this.logger.warn(`No successful proposals found for wedding ${weddingId} and service ${serviceType}`);
            return {
                weddingId,
                serviceType,
                criteria: [],
                proposals: [],
            };
        }

        // 2. Prepare analyses for AI comparison
        const analysesForAi: ProposalAnalysisResult[] = proposals.map(p => {
            const analysis = p.analysis!;
            return {
                resumo: analysis.summary,
                valorTotal: analysis.totalValue ? Number(analysis.totalValue) : null,
                condicoesPagamento: analysis.paymentTerms,
                pontuacaoClareza: analysis.clarityScore,
                pontuacaoConfianca: analysis.confidenceScore,
                riscos: (analysis.risks as any[]) || [],
                itens: (analysis.proposalItems as any[]).map(item => ({
                    textoOriginal: item.rawText,
                    chaveNormalizada: item.normalizedKey,
                    categoria: item.category,
                    incluido: item.included,
                    observacoes: item.notes,
                })),
                pontosFortes: (analysis.strengths as string[]) || [],
                pontosFracos: (analysis.weaknesses as string[]) || [],
                lacunasImportantes: (analysis.gaps as string[]) || [],
                diferenciais: (analysis.differentiators as string[]) || [],
                negotiationHighlights: (analysis.negotiationHighlights as string[]) || [],
                contractKeyPoints: (analysis.contractKeyPoints as string[]) || [],
            };
        });

        // 3. Build Criteria Map using AI-generated normalizedKey
        const criteriaMap = new Map<string, ComparisonCriterion>();

        for (const proposal of proposals) {
            if (!proposal.analysis || !proposal.analysis.proposalItems) continue;

            for (const item of proposal.analysis.proposalItems) {
                const key = item.normalizedKey;

                if (!criteriaMap.has(key)) {
                    criteriaMap.set(key, {
                        key,
                        label: item.rawText,
                        category: item.category,
                    });
                }
            }
        }

        // 4. Sort Criteria by Category then Label
        const sortedCriteria = Array.from(criteriaMap.values()).sort((a, b) => {
            const catCompare = a.category.localeCompare(b.category);
            if (catCompare !== 0) return catCompare;
            return a.label.localeCompare(b.label);
        });

        // 5. Map Proposals
        const comparedProposals: ComparedProposal[] = proposals.map(proposal => {
            const analysis = proposal.analysis!;
            const itemsMap: Record<string, ComparedItem> = {};

            const proposalItemsByKey = new Map<string, any>();
            for (const item of analysis.proposalItems) {
                proposalItemsByKey.set(item.normalizedKey, item);
            }

            for (const criterion of sortedCriteria) {
                const existingItem = proposalItemsByKey.get(criterion.key);

                if (existingItem) {
                    itemsMap[criterion.key] = {
                        status: existingItem.included === true ? 'included' : (existingItem.included === false ? 'not_included' : 'not_informed'),
                        notes: existingItem.notes || undefined,
                        originalName: existingItem.rawText,
                    };
                } else {
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

        // 6. Generate real AI Analysis
        this.logger.log(`Requesting real AI comparison for ${analysesForAi.length} analyses`);
        const aiResult = await this.aiService.compareProposals(analysesForAi);
        this.logger.log(`AI comparison completed successfully`);

        return {
            weddingId,
            serviceType,
            criteria: sortedCriteria,
            proposals: comparedProposals,
            aiAnalysis: aiResult,
        };
    }
}
