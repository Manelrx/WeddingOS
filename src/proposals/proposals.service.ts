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

    async create(vendorId: string, file: Express.Multer.File) {
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
        const proposal = await this.prisma.proposal.create({
            data: {
                vendorId,
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
        };

        try {
            await this.proposalQueue.add('process-proposal', payload);
            this.logger.log(`Enqueued proposal ${proposal.id} for processing`);
        } catch (error) {
            this.logger.error(`Failed to enqueue proposal ${proposal.id}`, error);
            // Note: We do not fail the request if enqueue fails, but we log it.
            // In a real scenario, we might want a fallback mechanism.
        }

        return proposal;
    }
}
