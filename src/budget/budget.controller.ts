
import { Controller, Get, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetSummaryDto } from './dto/budget-summary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) { }

    @Get('summary/:weddingId')
    async getSummary(@Param('weddingId') weddingId: string, @Req() req: any): Promise<BudgetSummaryDto> {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.budgetService.getBudgetSummary(weddingId, req.user.id);
    }
}
