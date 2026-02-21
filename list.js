const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const weddings = await prisma.wedding.findMany({ select: { id: true, title: true } });
    console.log(JSON.stringify(weddings, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
