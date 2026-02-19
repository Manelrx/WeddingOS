import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';
import { IsEnum, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { VendorStage } from '@prisma/client';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
    @IsOptional()
    @IsEnum(VendorStage)
    stage?: VendorStage;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsNumber()
    estimatedValue?: number;

    @IsOptional()
    @IsDateString()
    proposalValidUntil?: string;

    @IsOptional()
    @IsNumber()
    finalContractValue?: number;

    @IsOptional()
    @IsNumber()
    totalPaid?: number;
}
