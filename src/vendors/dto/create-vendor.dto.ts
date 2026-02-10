import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVendorDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    serviceType: string;
}
