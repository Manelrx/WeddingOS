const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const wedding = await prisma.wedding.findFirst();
    console.log(wedding ? wedding.id : 'NO_WEDDINGS_FOUND');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
