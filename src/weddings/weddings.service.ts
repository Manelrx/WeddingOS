import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetupWeddingDto } from './dto/setup-wedding.dto';
import { VendorStage } from '@prisma/client';

@Injectable()
export class WeddingsService {
    constructor(private readonly prisma: PrismaService) { }

    async findMyWedding(userId: string) {
        const wedding = await this.prisma.wedding.findFirst({
            where: {
                members: {
                    some: { userId }
                }
            },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true } } }
                }
            }
        });

        if (!wedding) {
            throw new NotFoundException(`Nenhum casamento vinculado a este usuário.`);
        }

        return wedding;
    }

    async updateBudget(weddingId: string, totalBudget: number, userId: string) {
        const wedding = await this.prisma.wedding.findFirst({
            where: {
                id: weddingId,
                members: { some: { userId } }
            }
        });

        if (!wedding) throw new NotFoundException('Casamento não encontrado ou acesso restrito.');

        return this.prisma.wedding.update({
            where: { id: weddingId },
            data: { totalBudget }
        });
    }

    async setup(setupDto: SetupWeddingDto, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const wedding = await tx.wedding.create({
                data: {
                    title: `Casamento de ${setupDto.coupleNames}`,
                    coupleNames: setupDto.coupleNames,
                    eventDate: setupDto.eventDate ? new Date(setupDto.eventDate) : null,
                    totalBudget: setupDto.totalBudget,
                    guestCount: setupDto.guestCount,
                    members: {
                        create: {
                            userId,
                            role: 'OWNER'
                        }
                    }
                },
            });

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
