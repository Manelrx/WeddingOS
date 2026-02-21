import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as fs from 'fs';
import { ProposalJobPayload } from '../queue/interfaces/proposal.job';

@Injectable()
export class ProposalsService {
    private readonly logger = new Logger(ProposalsService.name);

    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue('proposal-processing') private proposalQueue: Queue,
    ) { }

    async analyze(proposalId: string, context: 'proposal' | 'contract' | 'negotiation' = 'proposal') {
        // 1. Validate Proposal
        const proposal = await this.prisma.proposal.findUnique({
            where: { id: proposalId },
        });

        if (!proposal) {
            throw new NotFoundException(`Proposal with ID ${proposalId} not found`);
        }

        // 2. Prevent Duplicate Processing
        // if (proposal.status === 'PROCESSING') {
        //    return proposal; // Already processing, idempotent return
        // }

        // 3. Clean up existing analysis for re-run
        await this.prisma.proposalItem.deleteMany({
            where: {
                analysis: {
                    proposalId: proposalId
                }
            }
        });

        await this.prisma.proposalAnalysis.deleteMany({
            where: { proposalId },
        });

        // 4. Update Status to PROCESSING
        const updatedProposal = await this.prisma.proposal.update({
            where: { id: proposalId },
            data: { status: 'PROCESSING', errorMessage: null },
        });

        // 5. Enqueue Job
        const payload: ProposalJobPayload = {
            proposalId: updatedProposal.id,
            vendorId: updatedProposal.vendorId,
            filePath: updatedProposal.filePath,
            createdAt: updatedProposal.createdAt.toISOString(),
            version: 'v1',
            context,
        };

        try {
            await this.proposalQueue.add('process-proposal', payload);
            this.logger.log(`Enqueued proposal ${proposalId} for re-analysis`);
        } catch (error) {
            this.logger.error(`Failed to enqueue proposal ${proposalId}`, error);

            // Revert status on failure
            await this.prisma.proposal.update({
                where: { id: proposalId },
                data: {
                    status: 'QUEUE_FAILED',
                    errorMessage: `Failed to enqueue job: ${error.message}`
                },
            });
            throw error;
        }

        return updatedProposal;
    }

    async create(vendorId: string, file: Express.Multer.File, context: 'proposal' | 'contract' | 'negotiation' = 'proposal') {
        // 1. Validate Vendor
        const vendor = await this.prisma.vendor.findUnique({
            where: { id: vendorId },
        });

        if (!vendor) {
            // Cleanup: Delete the uploaded file if vendor doesn't exist
            if (file && file.path) {
                try {
                    fs.unlinkSync(file.path);
                } catch (err) {
                    this.logger.error('Error deleting file during cleanup:', err);
                }
            }
            throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
        }

        // 2. Create Proposal
        const originalName = file.originalname
            ? file.originalname.replace(/\.pdf$/i, '')
            : `Proposta ${new Date().toLocaleDateString('pt-BR')}`;

        const proposal = await this.prisma.proposal.create({
            data: {
                vendorId,
                name: originalName,
                filePath: file.path,
                status: 'PENDING',
            },
        });

        // 3. Enqueue Job
        const payload: ProposalJobPayload = {
            proposalId: proposal.id,
            vendorId: proposal.vendorId,
            filePath: proposal.filePath,
            createdAt: proposal.createdAt.toISOString(),
            version: 'v1',
            context,
        };

        try {
            await this.proposalQueue.add('process-proposal', payload);
            this.logger.log(`Enqueued proposal ${proposal.id} for processing`);
        } catch (error) {
            this.logger.error(`Failed to enqueue proposal ${proposal.id}`, error);

            // Mark as QUEUE_FAILED in the database
            await this.prisma.proposal.update({
                where: { id: proposal.id },
                data: {
                    status: 'QUEUE_FAILED',
                    errorMessage: `Failed to enqueue job: ${error.message}`
                },
            });
        }

        return proposal;
    }

    async getProposalFile(id: string) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id },
        });

        if (!proposal) {
            throw new NotFoundException(`Proposal with ID ${id} not found`);
        }

        if (!fs.existsSync(proposal.filePath)) {
            throw new NotFoundException(`File for proposal ${id} not found on server`);
        }

        return {
            path: proposal.filePath,
            filename: `Proposta-${id.substring(0, 8)}.pdf`,
            mimeType: 'application/pdf',
        };
    }

    async updateName(proposalId: string, name?: string) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id: proposalId },
        });

        if (!proposal) {
            throw new NotFoundException(`Proposal with ID ${proposalId} not found`);
        }

        return this.prisma.proposal.update({
            where: { id: proposalId },
            data: { name: name || proposal.name },
        });
    }
}
