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

    async create(weddingId: string, createVendorDto: CreateVendorDto, userId: string) {
        try {
            // Validate if wedding exists and user is a member
            const wedding = await this.prisma.wedding.findFirst({
                where: {
                    id: weddingId,
                    members: {
                        some: { userId }
                    }
                },
            });

            if (!wedding) {
                throw new NotFoundException(`Casamento não encontrado ou sem permissão de acesso.`);
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

<<<<<<< HEAD
    async findAll(weddingId: string, userId: string, serviceType?: string) {
        try {
            const wedding = await this.prisma.wedding.findFirst({
                where: { id: weddingId, members: { some: { userId } } }
            });

            if (!wedding) throw new NotFoundException(`Acesso negado ao casamento.`);

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
=======
    async findAll(weddingId: string, serviceType?: string) {
        try {
            const whereClause: any = { weddingId };
            if (serviceType) {
                whereClause.serviceType = serviceType;
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
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

    async findOne(id: string, userId: string) {
        const vendor = await this.prisma.vendor.findFirst({
            where: {
                id,
                wedding: {
                    members: { some: { userId } }
                }
            },
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
            throw new NotFoundException(`Fornecedor não encontrado ou sem permissão.`);
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

    async getFinancial(id: string, userId: string) {
        const vendor = await this.findOne(id, userId); // findOne already enforces tenant checks

        // (We expect to implement the dynamic financial data generation logic here for the budget later)
        // Note: the backend integration plan says GET /vendors/:id/financial should compute everything without persisting.
        // I will return a placeholder for now to satisfy the controller signature.
        return {
            id: vendor.id,
            financialStatus: vendor.totalValue > vendor.amountPaid ? 'EM_ABERTO' : 'PAGO'
        };
    }

    async update(id: string, updateVendorDto: UpdateVendorDto, userId: string) {
        // Check if vendor exists first to throw correct 404
        await this.findOne(id, userId);

        return this.prisma.vendor.update({
            where: { id },
            data: updateVendorDto,
        });
    }

    async remove(id: string, userId: string) {
        // Check if vendor exists first
        await this.findOne(id, userId);

        return this.prisma.vendor.delete({
            where: { id },
        });
    }
<<<<<<< HEAD
    async promoteToNegotiation(vendorId: string, proposalId: string, userId: string) {
        // 1. Validate
        const vendor = await this.prisma.vendor.findFirst({
            where: {
                id: vendorId,
                wedding: { members: { some: { userId } } }
            },
=======
    async promoteToNegotiation(vendorId: string, proposalId: string) {
        // 1. Validate
        const vendor = await this.prisma.vendor.findUnique({
            where: { id: vendorId },
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
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

<<<<<<< HEAD
    async analyzeProposal(proposalId: string, userId: string, context: 'proposal' | 'contract' | 'negotiation' = 'proposal') {
        const proposal = await this.prisma.proposal.findFirst({
            where: {
                id: proposalId,
                vendor: { wedding: { members: { some: { userId } } } }
            }
        });

        if (!proposal) throw new NotFoundException(`Proposta não encontrada ou acesso negado.`);

=======
    async analyzeProposal(proposalId: string, context: 'proposal' | 'contract' | 'negotiation' = 'proposal') {
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
        return this.proposalsService.analyze(proposalId, context);
    }
}
