import { Controller, Post, Param, UploadedFile, UseInterceptors, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
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
}
