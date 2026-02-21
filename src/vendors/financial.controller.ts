import { Controller, Get, Param } from '@nestjs/common';
import { FinancialService } from './financial.service';

@Controller('vendors/:id')
export class FinancialController {
    constructor(private readonly financialService: FinancialService) { }

    @Get('financial')
    async getFinancials(@Param('id') vendorId: string) {
        return this.financialService.getVendorFinancials(vendorId);
    }
}
