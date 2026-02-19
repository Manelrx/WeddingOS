
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const wedding = await prisma.wedding.create({
        data: {
            title: 'Casamento Teste & Demo',
            eventDate: new Date('2024-12-31'),
        }
    });
    console.log(`CREATED_WEDDING_ID: "${wedding.id}"`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
