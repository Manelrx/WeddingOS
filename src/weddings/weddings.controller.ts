import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { WeddingsService } from './weddings.service';
import { SetupWeddingDto } from './dto/setup-wedding.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('weddings')
export class WeddingsController {
    constructor(private readonly weddingsService: WeddingsService) { }

    @Post('setup')
    setup(@Body() setupDto: SetupWeddingDto, @Req() req: any) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.weddingsService.setup(setupDto, req.user.id);
    }

    @Get('my-wedding')
    findMyWedding(@Req() req: any) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.weddingsService.findMyWedding(req.user.id);
    }

    @Patch(':id/budget')
    updateBudget(@Param('id') id: string, @Body('totalBudget') totalBudget: number, @Req() req: any) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.weddingsService.updateBudget(id, totalBudget, req.user.id);
    }
}
