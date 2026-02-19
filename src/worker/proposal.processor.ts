import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ProposalJobPayload } from '../queue/interfaces/proposal.job';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProposalStatus } from '@prisma/client';

@Processor('proposal-processing', { concurrency: 5 })
export class ProposalProcessor extends WorkerHost {
    private readonly logger = new Logger(ProposalProcessor.name);

    constructor(
        private readonly aiService: AiService,
        private readonly prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job<ProposalJobPayload>): Promise<any> {
        const startTime = Date.now();
        const { proposalId } = job.data;

        this.logger.log(`Processing proposal ${proposalId} (v${job.data.version}, attempt ${job.attemptsMade + 1})`);

        try {
            // 1. Fetch & Update Status to PROCESSING
            const proposal = await this.prisma.proposal.update({
                where: { id: proposalId },
                data: { status: ProposalStatus.PROCESSING },
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
            const result = await this.aiService.analyzeProposal(proposal.filePath, proposalId);

            const durationMs = Date.now() - startTime;

            // 4. Persistence Transaction (mapping PT-BR fields to DB columns)
            await this.prisma.$transaction(async (tx) => {
                const analysis = await tx.proposalAnalysis.create({
                    data: {
                        proposalId: proposal.id,
                        summary: result.resumo,
                        totalValue: result.valorTotal != null ? result.valorTotal : undefined,
                        paymentTerms: result.condicoesPagamento,
                        clarityScore: result.pontuacaoClareza,
                        confidenceScore: result.pontuacaoConfianca,
                        risks: result.riscos as any, // Saving as JSON
                        strengths: result.pontosFortes as any,
                        weaknesses: result.pontosFracos as any,
                        gaps: result.lacunasImportantes as any,
                        differentiators: result.diferenciais as any,
                    },
                });

                // Create Items (mapping PT-BR fields to DB columns)
                if (result.itens && result.itens.length > 0) {
                    await tx.proposalItem.createMany({
                        data: result.itens.map(item => ({
                            analysisId: analysis.id,
                            rawText: item.textoOriginal,
                            normalizedKey: item.chaveNormalizada,
                            category: item.categoria,
                            included: item.incluido,
                            notes: item.observacoes ?? null,
                        })),
                    });
                }

                // Update Proposal metadata
                await tx.proposal.update({
                    where: { id: proposalId },
                    data: {
                        status: ProposalStatus.SUCCESS,
                        analyzedAt: new Date(),
                        processedAt: new Date(),
                        aiModelUsed: result.aiModelUsed,
                        analysisDurationMs: durationMs,
                        errorMessage: null,
                    },
                });
            });

            // Log risks
            if (result.riscos && result.riscos.length > 0) {
                this.logger.warn(`Riscos para proposta ${proposalId}: ${JSON.stringify(result.riscos)}`);
            }

            this.logger.log(
                `Proposta ${proposalId} processada em ${durationMs}ms | ` +
                `modelo=${result.aiModelUsed} | ` +
                `itens=${result.itens.length} | ` +
                `riscos=${result.riscos.length} | ` +
                `clareza=${result.pontuacaoClareza} | ` +
                `confiança=${result.pontuacaoConfianca} | ` +
                `arquivo=${result.fileSize}bytes`
            );

            return { status: 'completed', durationMs, fileSize: result.fileSize };

        } catch (error) {
            const durationMs = Date.now() - startTime;
            this.logger.error(`Erro ao processar proposta ${proposalId}: ${error.message}`, error.stack);

            try {
                await this.prisma.proposal.update({
                    where: { id: proposalId },
                    data: {
                        status: ProposalStatus.FAILED,
                        errorMessage: error.message,
                        analysisDurationMs: durationMs
                    },
                });
            } catch (updateError) {
                this.logger.error(`Falha ao atualizar status para FAILED: ${updateError.message}`);
            }

            throw error;
        }
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        this.logger.log(`Job ${job.id} ativo!`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        this.logger.error(`Job ${job.id} falhou após ${job.attemptsMade} tentativas: ${error.message}`);
    }
}
