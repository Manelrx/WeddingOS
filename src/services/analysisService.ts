import { AnalysisResult, AnalysisResultSchema } from '@/schemas';
import { geminiModel } from '@/lib/gemini';
const pdf = require('pdf-parse');
import fs from 'fs/promises';
import path from 'path';

export const analysisService = {
    async analyzePdf(formData: FormData): Promise<AnalysisResult> {
        const file = formData.get('file') as File;

        if (!file) {
            throw new Error('Nenhum arquivo enviado.');
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Extrair texto do PDF
        let pdfText = '';
        try {
            const pdfData = await pdf(buffer);
            pdfText = pdfData.text;
        } catch (error) {
            console.error('Erro ao ler PDF:', error);
            throw new Error('Falha ao processar o arquivo PDF.');
        }

        // 2. Ler o prompt do sistema
        const promptPath = path.join(process.cwd(), 'prompts', 'supplier_agent_prompt.md');
        let systemPrompt = '';
        try {
            systemPrompt = await fs.readFile(promptPath, 'utf-8');
        } catch (error) {
            console.error('Erro ao ler prompt:', error);
            throw new Error('Erro interno de configuração (Prompt não encontrado).');
        }

        // 3. Chamar o Gemini
        try {
            const contents = [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'user', parts: [{ text: `Aqui está o conteúdo do PDF da proposta:\n\n${pdfText}` }] }
            ];

            const result = await geminiModel.generateContent({ contents });
            const response = result.response;
            const text = response.text();

            // 4. Limpar e parsear JSON
            // Remove markdown code blocks if present
            const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

            const rawData = JSON.parse(jsonString);

            // 5. Validar com Zod
            const validatedData = AnalysisResultSchema.parse(rawData);

            return validatedData;

        } catch (error) {
            console.error('Erro na análise da IA:', error);
            throw new Error('Falha na análise inteligente da proposta via Google Gemini.');
        }
    }
}
