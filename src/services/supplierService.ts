import { Supplier, SupplierStatusSchema } from '@/schemas';
import { prisma } from '@/lib/prisma';

export const supplierService = {
    async getAll(): Promise<Supplier[]> {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Map Prisma result to Zod schema (handling optional fields and types)
        return suppliers.map(s => ({
            id: s.id,
            name: s.name,
            serviceType: s.serviceType,
            status: s.status as any, // Cast to enum type
            lastProposalDate: s.lastProposalDate ?? undefined
        }));
    },

    async add(supplier: Omit<Supplier, 'id' | 'status'>): Promise<Supplier> {
        const newSupplier = await prisma.supplier.create({
            data: {
                name: supplier.name,
                serviceType: supplier.serviceType,
                status: 'analisando',
                lastProposalDate: supplier.lastProposalDate || undefined
            }
        });

        return {
            id: newSupplier.id,
            name: newSupplier.name,
            serviceType: newSupplier.serviceType,
            status: newSupplier.status as any,
            lastProposalDate: newSupplier.lastProposalDate ?? undefined
        };
    },

    async updateStatus(id: string, status: Supplier['status']): Promise<void> {
        await prisma.supplier.update({
            where: { id },
            data: { status }
        });
    }
};
