import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WeddingsService } from './weddings.service';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { SetupWeddingDto } from './dto/setup-wedding.dto';

@Controller('weddings')
export class WeddingsController {
    constructor(private readonly weddingsService: WeddingsService) { }

    @Post()
    create(@Body() createWeddingDto: CreateWeddingDto) {
        return this.weddingsService.create(createWeddingDto);
    }

    @Post('setup')
    setup(@Body() setupDto: SetupWeddingDto) {
        return this.weddingsService.setup(setupDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.weddingsService.findOne(id);
    }
}
