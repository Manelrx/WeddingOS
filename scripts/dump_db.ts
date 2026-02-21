import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- EXHAUSTIVE DB DUMP ---');
    const weddings = await prisma.wedding.findMany();
    console.log('Weddings:', JSON.stringify(weddings, null, 2));

    const vendors = await prisma.vendor.findMany({
        include: { proposals: true }
    });
    console.log('\nVendors:', JSON.stringify(vendors, null, 2));

    const proposals = await prisma.proposal.findMany({
        include: { analysis: true }
    });
    console.log('\nProposals:', JSON.stringify(proposals, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
