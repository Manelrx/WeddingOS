import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create demo wedding with fixed ID
    const wedding = await prisma.wedding.upsert({
        where: { id: '857cfa73-9305-4b00-84e2-7746eed73ab8' },
        update: {},
        create: {
            id: '857cfa73-9305-4b00-84e2-7746eed73ab8',
            title: 'Casamento Demo',
            eventDate: new Date('2026-12-15'),
        },
    });

    console.log(`✅ Wedding criado: ${wedding.title} (${wedding.id})`);
    console.log('🎉 Seed completo!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
