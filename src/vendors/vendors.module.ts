import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { ProposalsModule } from '../proposals/proposals.module';

import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';

@Module({
    imports: [PrismaModule, ProposalsModule],
    controllers: [VendorsController, FinancialController],
    providers: [VendorsService, FinancialService],
})
export class VendorsModule { }
