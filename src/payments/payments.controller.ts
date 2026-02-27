import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    async create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.paymentsService.createPayment(createPaymentDto, req.user.id);
    }
}
