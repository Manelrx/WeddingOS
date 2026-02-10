import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(weddingId: string, createVendorDto: CreateVendorDto) {
        // Validate if wedding exists
        const wedding = await this.prisma.wedding.findUnique({
            where: { id: weddingId },
        });

        if (!wedding) {
            throw new NotFoundException(`Wedding with ID ${weddingId} not found`);
        }

        return this.prisma.vendor.create({
            data: {
                ...createVendorDto,
                weddingId,
                status: 'analyzing', // Default status
            },
        });
    }

    async findAll(weddingId: string) {
        // Ideally we should check if wedding exists here too, but for listing it might return empty array if not found or no vendors.
        // Let's keep it simple as per requirements.
        return this.prisma.vendor.findMany({
            where: { weddingId },
        });
    }

    async findOne(id: string) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id },
        });

        if (!vendor) {
            throw new NotFoundException(`Vendor with ID ${id} not found`);
        }

        return vendor;
    }

    async update(id: string, updateVendorDto: UpdateVendorDto) {
        // Check if vendor exists first to throw correct 404
        await this.findOne(id);

        return this.prisma.vendor.update({
            where: { id },
            data: updateVendorDto,
        });
    }

    async remove(id: string) {
        // Check if vendor exists first
        await this.findOne(id);

        return this.prisma.vendor.delete({
            where: { id },
        });
    }
}
