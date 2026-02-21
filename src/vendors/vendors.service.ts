import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorStage } from '@prisma/client';

import { ProposalsService } from '../proposals/proposals.service';

@Injectable()
export class VendorsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly proposalsService: ProposalsService
    ) { }

    async create(weddingId: string, createVendorDto: CreateVendorDto) {
        try {
            // Validate if wedding exists
            const wedding = await this.prisma.wedding.findUnique({
                where: { id: weddingId },
            });

            if (!wedding) {
                throw new NotFoundException(`Wedding with ID ${weddingId} not found`);
            }

            return await this.prisma.vendor.create({
                data: {
                    ...createVendorDto,
                    weddingId,
                    stage: VendorStage.ORCAMENTO, // Default stage
                },
            });
        } catch (error: any) {
            console.error("Critical Error in VendorsService.create:", error);
            throw new NotFoundException(`Error creating vendor: ${error.message}`);
        }
    }

    async findAll(weddingId: string, serviceType?: string) {
        try {
            const whereClause: any = { weddingId };
            if (serviceType) {
                // Multi-term mapping for common variations
                let categories: string[] = [serviceType];

                const normalized = serviceType.toLowerCase();
                if (normalized === 'decoracao' || normalized === 'decoração') categories.push('Decoração', 'Decoracao');
                if (normalized === 'musica' || normalized === 'música') categories.push('Música', 'Musica');
                if (normalized === 'espaco' || normalized === 'espaço' || normalized === 'local') categories.push('Espaço', 'local', 'Local', 'Local da cerimônia', 'espaço');
                if (normalized === 'buffet') categories.push('Buffet');
                if (normalized === 'fotografia') categories.push('Fotografia');

                whereClause.serviceType = {
                    in: categories,
                    mode: 'insensitive',
                };
            }

            const vendors = await this.prisma.vendor.findMany({
                where: whereClause,
                include: {
                    proposals: {
                        include: {
                            analysis: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    payments: true
                }
            });

            return {
                vendors: vendors.map(vendor => {
                    const latestProposal = vendor.proposals?.[0];
                    const analysis = latestProposal?.analysis;

                    const totalValue = analysis?.totalValue ? Number(analysis.totalValue) : 0;

                    const finalValue = vendor.finalContractValue ? Number(vendor.finalContractValue) : 0;
                    const paid = vendor.payments ? vendor.payments.reduce((sum, p) => sum + Number(p.amount), 0) : 0;

                    // If contracted/finalized, use finalValue as basis. Otherwise use estimated or proposal value.
                    const basisValue = finalValue > 0 ? finalValue : (vendor.estimatedValue ? Number(vendor.estimatedValue) : totalValue);
                    const remaining = basisValue - paid;

                    return {
                        id: vendor.id,
                        weddingId: vendor.weddingId,
                        name: vendor.name,
                        category: vendor.serviceType,
                        stage: vendor.stage,
                        totalValue: finalValue > 0 ? finalValue : (vendor.estimatedValue ? Number(vendor.estimatedValue) : totalValue),
                        estimatedValue: vendor.estimatedValue ? Number(vendor.estimatedValue) : 0,
                        finalContractValue: finalValue,
                        totalPaid: paid,
                        remainingBalance: remaining,
                        proposalCount: vendor.proposals?.length || 0
                    };
                })
            };
        } catch (error: any) {
            console.error("Critical Error in VendorsService.findAll:", error);
            throw new NotFoundException(`Error fetching vendors: ${error.message}`);
        }
    }

    async findOne(id: string) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id },
            include: {
                proposals: {
                    include: {
                        analysis: {
                            include: {
                                proposalItems: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                payments: true
            }
        });

        if (!vendor) {
            throw new NotFoundException(`Vendor with ID ${id} not found`);
        }

        // Logic to get total value from the latest proposal analysis
        // If selectedProposalId exists, prioritize it for financials?
        // For now, let's keep latest, but UI might want selected.
        const latestProposal = vendor.proposals?.[0];
        const analysis = latestProposal?.analysis;

        const totalValue = analysis?.totalValue ? Number(analysis.totalValue) : 0;

        const finalContractValue = vendor.finalContractValue ? Number(vendor.finalContractValue) : 0;
        const amountPaid = vendor.payments ? vendor.payments.reduce((sum, p) => sum + Number(p.amount), 0) : 0;

        const basisValue = finalContractValue > 0 ? finalContractValue : (vendor.estimatedValue ? Number(vendor.estimatedValue) : totalValue);
        const remainingBalance = basisValue - amountPaid;

        const paymentConditions = analysis?.paymentTerms || "Não informado";

        return {
            id: vendor.id,
            weddingId: vendor.weddingId,
            name: vendor.name,
            category: vendor.serviceType,
            stage: vendor.stage,
            notes: vendor.notes || '',
            estimatedValue: vendor.estimatedValue ? Number(vendor.estimatedValue) : 0,

            // Financials
            totalValue: finalContractValue > 0 ? finalContractValue : (vendor.estimatedValue ? Number(vendor.estimatedValue) : totalValue),
            finalContractValue: finalContractValue,
            amountPaid: amountPaid,
            remainingBalance: remainingBalance,

            paymentConditions: paymentConditions,
            proposalValidUntil: vendor.proposalValidUntil,
            selectedProposalId: vendor.selectedProposalId,

            proposals: vendor.proposals?.map(p => {
                const pAnalysis = p.analysis;
                return {
                    id: p.id,
                    name: p.name || `Proposta ${p.createdAt.toLocaleDateString('pt-BR')}`,
                    totalValue: pAnalysis?.totalValue ? Number(pAnalysis.totalValue) : 0,
                    createdAt: p.createdAt.toISOString(),
                    status: p.status,
                    analysis: pAnalysis ? {
                        summary: pAnalysis.summary,
                        clarityScore: pAnalysis.clarityScore,
                        confidenceScore: pAnalysis.confidenceScore,
                        risks: (pAnalysis.risks as any) || [],
                        strengths: (pAnalysis.strengths as any) || [],
                        weaknesses: (pAnalysis.weaknesses as any) || [],
                        gaps: (pAnalysis.gaps as any) || [],
                        diferenciais: (pAnalysis.differentiators as any) || [],
                        negotiationHighlights: (pAnalysis.negotiationHighlights as any) || [],
                        contractKeyPoints: (pAnalysis.contractKeyPoints as any) || [],
                        itens: pAnalysis.proposalItems?.map(item => ({
                            textoOriginal: item.rawText,
                            chaveNormalizada: item.normalizedKey,
                            categoria: item.category,
                            incluido: item.included,
                            observacoes: item.notes
                        })) || []
                    } : null
                };
            }) || []
        };
    }

    async update(id: string, updateVendorDto: UpdateVendorDto) {
        // Check if vendor exists first to throw correct 404
        await this.findOne(id);

        return this.prisma.vendor.update({
            where: { id },
            data: updateVendorDto,
        });
    }

    async remove(id: string) {
        // Check if vendor exists first
        await this.findOne(id);

        return this.prisma.vendor.delete({
            where: { id },
        });
    }
    async promoteToNegotiation(vendorId: string, proposalId: string) {
        // 1. Validate
        const vendor = await this.prisma.vendor.findUnique({
            where: { id: vendorId },
            include: { proposals: true }
        });
        if (!vendor) throw new NotFoundException(`Vendor ${vendorId} not found`);

        const proposal = vendor.proposals.find(p => p.id === proposalId);
        if (!proposal) throw new NotFoundException(`Proposal ${proposalId} not found for this vendor`);

        // 2. Update Vendor
        const updatedVendor = await this.prisma.vendor.update({
            where: { id: vendorId },
            data: {
                stage: VendorStage.NEGOCIACAO,
                selectedProposalId: proposalId
            } // We expect the schema update to be active
        });

        // 3. Trigger Negotiation Analysis
        // This will re-analyze the PDF with the 'negotiation' context to extract strategy.
        await this.proposalsService.analyze(proposalId, 'negotiation');

        return updatedVendor;
    }

    async analyzeProposal(proposalId: string, context: 'proposal' | 'contract' | 'negotiation' = 'proposal') {
        return this.proposalsService.analyze(proposalId, context);
    }
}
