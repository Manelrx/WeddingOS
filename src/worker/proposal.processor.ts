import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ProposalJobPayload } from '../queue/interfaces/proposal.job';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProposalStatus, ProposalItemStatus } from '@prisma/client';

@Processor('proposal-processing')
export class ProposalProcessor extends WorkerHost {
    private readonly logger = new Logger(ProposalProcessor.name);

    constructor(
        private readonly aiService: AiService,
        private readonly prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job<ProposalJobPayload>): Promise<any> {
        this.logger.log(`Processing proposal ${job.data.proposalId} (v${job.data.version})`);
        const { proposalId } = job.data;

        try {
            // 1. Fetch Proposal
            const proposal = await this.prisma.proposal.findUnique({
                where: { id: proposalId },
                include: { vendor: true },
            });

            if (!proposal) {
                this.logger.error(`Proposal ${proposalId} not found.`);
                return;
            }

            // 2. Idempotency Check
            const existingAnalysis = await this.prisma.proposalAnalysis.findUnique({
                where: { proposalId },
            });

            if (existingAnalysis) {
                this.logger.log(`Proposal ${proposalId} already analyzed. Skipping AI call.`);
                return { status: 'skipped', reason: 'already_analyzed' };
            }

            // 3. Call AI Service
            this.logger.log(`Calling AI Service for proposal ${proposalId}...`);
            const analysisResult = await this.aiService.analyzeProposal(proposal.filePath, proposalId);

            // 4. Handle Success -> Create Records directly in a transaction or sequentially?
            // The logic: Create ProposalAnalysis -> Create Items -> Update Status

            await this.prisma.$transaction(async (tx) => {
                // Create Analysis
                const analysis = await tx.proposalAnalysis.create({
                    data: {
                        proposalId: proposal.id,
                        summary: analysisResult.summary,
                        totalValue: analysisResult.totalValue ? analysisResult.totalValue : undefined, // Ensure it fits schema
                        paymentTerms: analysisResult.paymentTerms,
                        clarityScore: analysisResult.confidenceScore ? Math.round(analysisResult.confidenceScore) : 0,
                    },
                });

                // Create Items
                if (analysisResult.items && analysisResult.items.length > 0) {
                    await tx.proposalItem.createMany({
                        data: analysisResult.items.map(item => ({
                            analysisId: analysis.id,
                            name: item.name,
                            category: item.category || 'General',
                            status: this.mapItemStatus(item.status),
                            notes: item.notes,
                        })),
                    });
                }

                // Update Status
                await tx.proposal.update({
                    where: { id: proposalId },
                    data: {
                        status: ProposalStatus.SUCCESS,
                        analyzedAt: new Date(),
                    },
                });
            });

            // Log Risks (Not Persisted)
            if (analysisResult.risks && analysisResult.risks.length > 0) {
                this.logger.warn(`Risks identified for proposal ${proposalId}: ${JSON.stringify(analysisResult.risks)}`);
                // TODO: persist risks when schema evolves
            }

            this.logger.log(`Proposal ${proposalId} processed successfully.`);
            return { status: 'completed' };

        } catch (error) {
            this.logger.error(`Error processing proposal ${proposalId}: ${error.message}`, error.stack);

            // Update Status to ERROR
            try {
                await this.prisma.proposal.update({
                    where: { id: proposalId },
                    data: { status: ProposalStatus.ERROR },
                });
            } catch (updateError) {
                this.logger.error(`Failed to update status to ERROR for proposal ${proposalId}: ${updateError.message}`);
            }

            throw error; // Let BullMQ handle retry logic or failure
        }
    }

    private mapItemStatus(status: string): ProposalItemStatus {
        switch (status) {
            case 'included': return ProposalItemStatus.included;
            case 'not_included': return ProposalItemStatus.not_included;
            case 'not_informed': return ProposalItemStatus.not_informed;
            default: return ProposalItemStatus.not_informed;
        }
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        this.logger.log(`Job ${job.id} is active!`);
    }
}

