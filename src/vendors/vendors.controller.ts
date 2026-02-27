<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
=======
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    @Post('weddings/:weddingId/vendors')
    create(
        @Param('weddingId') weddingId: string,
        @Body() createVendorDto: CreateVendorDto,
        @Req() req: any
    ) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.vendorsService.create(weddingId, createVendorDto, req.user.id);
    }

    @Patch('vendors/:id/promote')
    promoteToNegotiation(
        @Param('id') id: string,
        @Body() body: { proposalId: string },
        @Req() req: any
    ) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.vendorsService.promoteToNegotiation(id, body.proposalId, req.user.id);
    }

    @Patch('vendors/:id/promote')
    promoteToNegotiation(
        @Param('id') id: string,
        @Body() body: { proposalId: string }
    ) {
        return this.vendorsService.promoteToNegotiation(id, body.proposalId);
    }

    @Get('weddings/:weddingId/vendors')
<<<<<<< HEAD
    findAll(@Param('weddingId') weddingId: string, @Req() req: any, @Query('serviceType') serviceType?: string) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.vendorsService.findAll(weddingId, req.user.id, serviceType);
=======
    findAll(@Param('weddingId') weddingId: string, @Query('serviceType') serviceType?: string) {
        return this.vendorsService.findAll(weddingId, serviceType);
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
    }

    @Get('vendors/:id')
    findOne(@Param('id') id: string, @Req() req: any) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.vendorsService.findOne(id, req.user.id);
    }

    @Get('vendors/:id/financial')
    getFinancial(@Param('id') id: string, @Req() req: any) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.vendorsService.getFinancial(id, req.user.id);
    }

    @Patch('vendors/:id')
    update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto, @Req() req: any) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.vendorsService.update(id, updateVendorDto, req.user.id);
    }

    @Delete('vendors/:id')
    remove(@Param('id') id: string, @Req() req: any) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        return this.vendorsService.remove(id, req.user.id);
    }

    @Post('vendors/:proposalId/analyze')
    analyze(@Param('proposalId') proposalId: string, @Req() req: any, @Body() body: { context?: 'proposal' | 'contract' | 'negotiation' }) {
        if (!req.user || !req.user.id) throw new UnauthorizedException();
        // Since proposal ID doesn't have wedding directly in URL, tenant check must be done in service.
        return this.vendorsService.analyzeProposal(proposalId, req.user.id, body?.context || 'proposal');
    }

    @Post('vendors/:proposalId/analyze')
    analyze(@Param('proposalId') proposalId: string, @Body() body: { context?: 'proposal' | 'contract' | 'negotiation' }) {
        return this.vendorsService.analyzeProposal(proposalId, body?.context || 'proposal');
    }

}
