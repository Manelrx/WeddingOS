import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller()
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    @Post('weddings/:weddingId/vendors')
    create(
        @Param('weddingId') weddingId: string,
        @Body() createVendorDto: CreateVendorDto,
    ) {
        return this.vendorsService.create(weddingId, createVendorDto);
    }

    @Get('weddings/:weddingId/vendors')
    findAll(@Param('weddingId') weddingId: string) {
        return this.vendorsService.findAll(weddingId);
    }

    @Get('vendors/:id')
    findOne(@Param('id') id: string) {
        return this.vendorsService.findOne(id);
    }

    @Patch('vendors/:id')
    update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
        return this.vendorsService.update(id, updateVendorDto);
    }

    @Delete('vendors/:id')
    remove(@Param('id') id: string) {
        return this.vendorsService.remove(id);
    }
}
