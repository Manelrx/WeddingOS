import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const p = await prisma.proposal.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { analysis: true }
    });

    if (!p) {
        console.log('No proposals found.');
        return;
    }

    console.log('--- PROPOSAL STATUS ---');
    console.log('ID:', p.id);
    console.log('Status:', p.status);
    console.log('Model:', p.aiModelUsed);
    console.log('Duration:', p.analysisDurationMs, 'ms');
    console.log('Error Message:', p.errorMessage);
    console.log('Analysis:', p.analysis ? 'SUCCESSFULLY SAVED' : 'NOT FOUND');
}

main().catch(console.error).finally(() => prisma.$disconnect());
