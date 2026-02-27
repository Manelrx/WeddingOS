<<<<<<< HEAD
import { Controller, Get, Param } from '@nestjs/common';
import { FinancialService } from './financial.service';
=======

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208

@Controller('vendors/:id')
export class FinancialController {
    constructor(private readonly financialService: FinancialService) { }

    @Get('financial')
    async getFinancials(@Param('id') vendorId: string) {
        return this.financialService.getVendorFinancials(vendorId);
    }
<<<<<<< HEAD
=======

    @Post('payments')
    async registerPayment(@Param('id') vendorId: string, @Body() body: CreatePaymentDto) {
        // Ensure vendorId matches
        return this.financialService.registerPayment({ ...body, vendorId });
    }
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
}
