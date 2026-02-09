'use server'

import { supplierService } from '@/services/supplierService';
import { SupplierSchema } from '@/schemas';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createSupplierAction(data: any) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const validated = SupplierSchema.pick({ name: true, serviceType: true }).safeParse(data);

    if (!validated.success) {
        return { success: false, error: 'Dados inválidos. Verifique os campos.' };
    }

    try {
        await supplierService.add(validated.data);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Erro ao criar fornecedor.' };
    }
}
