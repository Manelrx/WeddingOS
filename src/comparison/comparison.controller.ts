import { Controller, Get, Param } from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { ComparisonMatrix } from './interfaces/comparison-matrix.interface';

@Controller('weddings/:weddingId/comparisons')
export class ComparisonController {
    constructor(private readonly comparisonService: ComparisonService) { }

    @Get(':serviceType')
    async getComparison(
        @Param('weddingId') weddingId: string,
        @Param('serviceType') serviceType: string,
    ): Promise<ComparisonMatrix> {
        return this.comparisonService.compare(weddingId, serviceType);
    }
}
