import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { VendorStatus } from '@prisma/client';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
    @IsOptional()
    @IsEnum(VendorStatus)
    status?: VendorStatus;
}
