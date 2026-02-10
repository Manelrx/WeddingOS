import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWeddingDto } from './dto/create-wedding.dto';

@Injectable()
export class WeddingsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createWeddingDto: CreateWeddingDto) {
        return this.prisma.wedding.create({
            data: {
                title: createWeddingDto.title,
                eventDate: createWeddingDto.eventDate ? new Date(createWeddingDto.eventDate) : null,
            },
        });
    }

    async findOne(id: string) {
        const wedding = await this.prisma.wedding.findUnique({
            where: { id },
        });

        if (!wedding) {
            throw new NotFoundException(`Wedding with ID ${id} not found`);
        }

        return wedding;
    }
}
