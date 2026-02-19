
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const wedding = await prisma.wedding.findFirst();
    if (wedding) {
        console.log(`"${wedding.id}"`);
    } else {
        console.error('No wedding found');
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
