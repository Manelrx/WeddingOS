
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('vendors/:id')
export class FinancialController {
    constructor(private readonly financialService: FinancialService) { }

    @Get('financial')
    async getFinancials(@Param('id') vendorId: string) {
        return this.financialService.getVendorFinancials(vendorId);
    }

    @Post('payments')
    async registerPayment(@Param('id') vendorId: string, @Body() body: CreatePaymentDto) {
        // Ensure vendorId matches
        return this.financialService.registerPayment({ ...body, vendorId });
    }
}
