
import { Controller, Get, Param } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetSummaryDto } from './dto/budget-summary.dto';

@Controller('budget')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) { }

    @Get('summary/:weddingId')
    async getSummary(@Param('weddingId') weddingId: string): Promise<BudgetSummaryDto> {
        return this.budgetService.getBudgetSummary(weddingId);
    }
}
