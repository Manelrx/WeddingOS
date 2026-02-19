
import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('summary/:weddingId')
    async getSummary(@Param('weddingId') weddingId: string) {
        return this.dashboardService.getSummary(weddingId);
    }
}
