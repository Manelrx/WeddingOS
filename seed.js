const { PrismaClient, VendorStage } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const wedding = await prisma.wedding.create({
        data: {
            title: 'Casamento Teste Local',
            coupleNames: 'Demo Casal',
            eventDate: new Date('2026-10-10'),
            guestCount: 150,
            totalBudget: 100000,
            vendors: {
                create: [
                    {
                        name: 'Villa Bisutti',
                        serviceType: 'Espaço',
                        stage: VendorStage.CONTRATADO,
                        finalContractValue: 25000,
                    },
                    {
                        name: 'Ana Fotografia',
                        serviceType: 'Fotógrafo',
                        stage: VendorStage.NEGOCIACAO,
                        estimatedValue: 8000,
                    }
                ]
            }
        }
    });

    console.log('Seeds created:', wedding.id);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
