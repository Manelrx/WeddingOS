
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEMO_WEDDING_ID = '857cfa73-9305-4b00-84e2-7746eed73ab8';

async function main() {
    // 1. Ensure Wedding exists
    let wedding = await prisma.wedding.findUnique({ where: { id: DEMO_WEDDING_ID } });
    if (!wedding) {
        wedding = await prisma.wedding.create({
            data: {
                id: DEMO_WEDDING_ID,
                title: 'Casamento Demo',
                totalBudget: 50000,
                eventDate: new Date('2026-12-12')
            }
        });
        console.log('Created wedding:', wedding.id);
    } else {
        // Update budget if null
        if (!wedding.totalBudget) {
            await prisma.wedding.update({
                where: { id: DEMO_WEDDING_ID },
                data: { totalBudget: 50000 }
            });
        }
    }

    // 2. Ensure Vendor exists
    const vendor = await prisma.vendor.create({
        data: {
            weddingId: DEMO_WEDDING_ID,
            name: 'Villa Giardini (Demo)',
            serviceType: 'Espaço',
            stage: 'CONTRATADO',
            finalContractValue: 25000,
            totalPaid: 20000,
            remainingBalance: 5000,
            notes: 'Saldo final ajustável conforme número de convidados.'
        }
    });
    console.log('Created vendor:', vendor.id);

    // 3. Create Installments
    await prisma.installment.createMany({
        data: [
            { vendorId: vendor.id, amount: 15000, dueDate: new Date('2026-01-10'), status: 'PAGO' }, // Paid
            { vendorId: vendor.id, amount: 5000, dueDate: new Date('2026-02-10'), status: 'PAGO' }, // Paid
            { vendorId: vendor.id, amount: 5000, dueDate: new Date('2026-03-10'), status: 'EM_ABERTO' }, // Pending
            { vendorId: vendor.id, amount: 10000, dueDate: new Date('2026-04-10'), status: 'EM_ABERTO' }, // Pending
        ]
    });

    // Need to link payments to paid installments? Schema has paymentId unique.
    // Ideally we create payments and link them.
    // Checking schema: Installment has paymentId? @unique
    // Let's create a payment for the first installment properly.

    const payment = await prisma.payment.create({
        data: {
            vendorId: vendor.id,
            amount: 15000,
            dueDate: new Date('2026-01-10'),
            paidAt: new Date('2026-01-10'),
            status: 'PAGO',
            paymentMethod: 'PIX'
        }
    });

    // Link it
    const inst1 = await prisma.installment.findFirst({ where: { vendorId: vendor.id, amount: 15000 } });
    if (inst1) {
        await prisma.installment.update({
            where: { id: inst1.id },
            data: { paymentId: payment.id }
        });
    }

    console.log('Test data setup complete.');
    console.log('VENDOR_ID=' + vendor.id);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
