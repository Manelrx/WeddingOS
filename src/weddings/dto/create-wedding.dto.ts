import { IsString, IsNotEmpty, IsOptional, IsISO8601 } from 'class-validator';

export class CreateWeddingDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsISO8601()
    eventDate?: string;
}
