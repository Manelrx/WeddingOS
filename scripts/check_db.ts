import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- PROPOSALS BY CATEGORY ---');

    const proposals = await prisma.proposal.findMany({
        include: { vendor: true }
    });

    const counts = {};
    proposals.forEach(p => {
        const cat = p.vendor?.serviceType || 'Unknown';
        counts[cat] = (counts[cat] || 0) + 1;
    });

    console.log('Categories with Proposals:', JSON.stringify(counts, null, 2));

    const vendors = await prisma.vendor.findMany();
    const vendorCounts = {};
    vendors.forEach(v => {
        vendorCounts[v.serviceType] = (vendorCounts[v.serviceType] || 0) + 1;
    });
    console.log('\nCategories with Vendors:', JSON.stringify(vendorCounts, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
