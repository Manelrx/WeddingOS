import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ServiceExpectedBudgetDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNumber()
    @Min(0)
    expectedValue: number;
}

export class SetupWeddingDto {
    @IsString()
    @IsNotEmpty()
    coupleNames: string;

    @IsString()
    @IsOptional()
    eventDate?: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    guestCount?: number;

    @IsNumber()
    @Min(0)
    totalBudget: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServiceExpectedBudgetDto)
    @IsOptional()
    services?: ServiceExpectedBudgetDto[];
}
