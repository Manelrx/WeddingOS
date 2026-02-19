
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const wedding = await prisma.wedding.findFirst({
        orderBy: { createdAt: 'desc' }
    });
    if (wedding) {
        fs.writeFileSync('wedding_id.txt', wedding.id);
        console.log('Written ID to wedding_id.txt');
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
