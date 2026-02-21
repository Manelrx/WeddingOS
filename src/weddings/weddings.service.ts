import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { SetupWeddingDto } from './dto/setup-wedding.dto';
import { VendorStage } from '@prisma/client';

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

    async setup(setupDto: SetupWeddingDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Create the Wedding tenant
            const wedding = await tx.wedding.create({
                data: {
                    title: `Casamento de ${setupDto.coupleNames}`, // fallback title
                    coupleNames: setupDto.coupleNames,
                    eventDate: setupDto.eventDate ? new Date(setupDto.eventDate) : null,
                    totalBudget: setupDto.totalBudget,
                    guestCount: setupDto.guestCount,
                },
            });

            // 2. Create the placeholder/shell Vendors for each selected service
            if (setupDto.services && setupDto.services.length > 0) {
                const vendorData = setupDto.services.map(service => ({
                    weddingId: wedding.id,
                    name: `Fornecedor de ${service.type} (Pendente)`,
                    serviceType: service.type,
                    estimatedValue: service.expectedValue,
                    stage: VendorStage.ORCAMENTO,
                }));

                await tx.vendor.createMany({
                    data: vendorData,
                });
            }

            return wedding;
        });
    }
}
