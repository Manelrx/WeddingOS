
import { Controller, Post, Get, Patch, Param, Body, UploadedFile, UseInterceptors, ParseUUIDPipe, BadRequestException, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { ProposalsService } from './proposals.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vendors')
export class ProposalsController {
    constructor(private readonly proposalsService: ProposalsService) { }

    @Post(':vendorId/proposals')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProposal(
        @Param('vendorId', ParseUUIDPipe) vendorId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('File is required and must be a PDF');
        }

        const proposal = await this.proposalsService.create(vendorId, file);

        return {
            id: proposal.id,
            status: proposal.status,
            createdAt: proposal.createdAt,
        };
    }

    @Post(':proposalId/analyze')
    async analyzeProposal(@Param('proposalId', ParseUUIDPipe) proposalId: string) {
        const proposal = await this.proposalsService.analyze(proposalId);
        return {
            id: proposal.id,
            status: proposal.status,
        };
    }

    @Get(':id/download')
    async downloadProposal(@Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) res: Response) {
        const fileData = await this.proposalsService.getProposalFile(id);

        const file = fs.createReadStream(fileData.path);

        res.set({
            'Content-Type': fileData.mimeType,
            'Content-Disposition': `attachment; filename="${fileData.filename}"`,
        });

        return new StreamableFile(file);
    }

    @Patch(':proposalId')
    async updateProposal(
        @Param('proposalId', ParseUUIDPipe) proposalId: string,
        @Body() body: { name?: string },
    ) {
        return this.proposalsService.updateName(proposalId, body.name);
    }
}
