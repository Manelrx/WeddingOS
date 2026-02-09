'use server'

import { analysisService } from '@/services/analysisService';

export async function analyzeProposalAction(formData: FormData) {
    try {
        const result = await analysisService.analyzePdf(formData);
        return { success: true, data: result };
    } catch (error) {
        console.error('Server Action Error:', error);
        return { success: false, error: 'Falha na análise do arquivo.' };
    }
}
