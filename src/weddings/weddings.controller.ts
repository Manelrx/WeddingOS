import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WeddingsService } from './weddings.service';
import { CreateWeddingDto } from './dto/create-wedding.dto';

@Controller('weddings')
export class WeddingsController {
    constructor(private readonly weddingsService: WeddingsService) { }

    @Post()
    create(@Body() createWeddingDto: CreateWeddingDto) {
        return this.weddingsService.create(createWeddingDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.weddingsService.findOne(id);
    }
}
