
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// Mock Config Service
const configService = {
    get: (key) => {
        if (key === 'GEMINI_API_KEY') return 'AIzaSyC7iF8yIdl2qyikMS5F3Xzq2Ret8mAUVwM'; // Hardcoded for test
        return null;
    }
};

// Mock Storage Provider
const storageProvider = {
    getFileBuffer: async (filePath) => {
        // In a real scenario, this would fetch from storage.
        // For this test, we need a real PDF path or we can mock the buffer if we had a sample.
        // Let's list files in the uploads directory to find a valid PDF.
        const uploadsDir = path.join(__dirname, 'uploads');
        // We will assume a file exists for the sake of the test or fail gracefully
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        return fs.readFileSync(filePath);
    }
};

// Re-implementing parts of GeminiProvider for standalone test
class GeminiProviderTest {
    constructor() {
        const apiKey = configService.get('GEMINI_API_KEY');
        this.ai = new GoogleGenAI({ apiKey });
        this.modelName = 'gemini-3-flash-preview';
    }

    buildPrompt(context = 'proposal') {
        const isContract = context === 'contract';
        const isNegotiation = context === 'negotiation';

        return `Você é o ${isContract ? 'Advogado Especialista em Contratos de Casamento' : isNegotiation ? 'Estrategista Sênior de Negociação de Eventos' : 'Analisador de Propostas de Casamento'} do WeddingOS.
Sua tarefa é extrair dados estruturados de um ${isContract ? 'contrato ou minuta contratual' : 'PDF de proposta'} de fornecedor de casamento${isNegotiation ? ' com foco TOTAL em encontrar oportunidades de economia e melhoria de termos' : ''}.

## REGRAS ABSOLUTAS

1. NUNCA assuma, infira ou estime qualquer dado. Extraia APENAS o que está explicitamente escrito.
2. Se um valor não estiver explicitamente declarado no documento, retorne null. NÃO adivinhe.
3. Retorne APENAS JSON válido. Sem markdown, sem explicações, sem comentários fora do JSON.
4. Separe extração factual de interpretação. Fatos vão nos itens. Interpretação vai nos riscos/estratégias.
5. Retorne o JSON exclusivamente em português.
6. Não converta valores monetários.

## INSTRUÇÕES POR CONTEXTO

**CONTEXTO ATUAL: ${context.toUpperCase()}**

${isContract ? `
- Foco: Segurança jurídica, multas abusivas, prazos de entrega e cancelamento.
- Identifique cláusulas leoninas (que favorecem apenas o fornecedor).
- Verifique se há menção explícita a data, horário e local.
` : isNegotiation ? `
- Foco: CUSTO-BENEFÍCIO e ALAVANCAS DE NEGOCIAÇÃO.
- Identifique condições de pagamento que podem ser melhoradas (ex: desconto à vista).
- Aponte itens que geralmente são cortesias em outros fornecedores.
- Critique prazos de validade da proposta muito curtos (pressão de venda).
` : `
- Foco: Clareza do escopo e valores.
- Liste exatamente o que está incluso e o que não está.
`}

## INSTRUÇÕES DE EXTRAÇÃO

### resumo
${isContract
                ? 'Resumo JURÍDICO: Objeto, obrigações principais, prazos de entrega e condições de rescisão.'
                : isNegotiation
                    ? 'Resumo ESTRATÉGICO: Avaliação direta do "poder de barganha". O fornecedor parece flexível? O preço está alinhado ao mercado (baseado no que consta no doc)?'
                    : 'Resumo FATUAL: O que está sendo ofertado, para qual data e o valor total.'}

### valorTotal
Extraia o valor monetário total como número.

### condicoesPagamento
Extraia as condições de pagamento, datas de vencimento e multas.

### pontuacaoClareza (0–100)
Avalie quão claro e completo é o documento para o objetivo atual (${context}).

### pontuacaoConfianca (0–1)
Sua confiança na extração dos dados.

### riscos
Classifique cada risco em:
- "financeiro": ${isContract ? 'Multas > 30% contrato, juros abusivos.' : 'Custos extras não inclusos, taxas de deslocamento.'}
- "contratual": ${isContract ? 'Rescisão sem devolução, ausência de responsabilidade civil.' : 'Termos vagos como "a combinar".'}
- "operacional": Horas extras, alimentação da equipe.

Severidade (baixa/média/alta).

### itens
Liste os serviços/produtos contratados.

### pontosFortes
${isContract ? 'Cláusulas que protegem os noivos.' : 'Itens de alto valor inclusos, boas condições de parcelamento.'}

### pontosFracos
${isContract ? 'Cláusulas vagas, multas desproporcionais.' : 'Ausência de itens essenciais, validade curta da proposta.'}

### negotiationHighlights
${isNegotiation
                ? 'OBRIGATÓRIO: Liste 3 a 5 estratégias PRÁTICAS e ACIONÁVEIS para negociar. Ex: "Solicitar desconto de 5% para pagamento à vista (atualmente sem desconto)", "Pedir inclusão do item X como bônus", "Remover taxa de deslocamento". Seja específico baseado no conteúdo.'
                : 'Deixe vazio ou null.'}

### contractKeyPoints
${isContract
                ? 'OBRIGATÓRIO: Liste 3 a 5 pontos CRÍTICOS para revisão jurídica. Ex: "Cláusula X permite cancelamento unilateral sem multa", "Não há definição de prazo para entrega das fotos".'
                : 'Deixe vazio ou null.'}`;
    }

    async analyze(filePath, context) {
        console.log(`Analyzing ${filePath} with context: ${context}`);
        const fileBuffer = await storageProvider.getFileBuffer(filePath);
        const base64Data = fileBuffer.toString('base64');

        const response = await this.ai.models.generateContent({
            model: this.modelName,
            contents: [{
                role: 'user',
                parts: [
                    { inlineData: { data: base64Data, mimeType: 'application/pdf' } },
                    { text: 'Analise esta proposta. Retorne JSON válido.' }
                ]
            }],
            config: {
                systemInstruction: this.buildPrompt(context),
                temperature: 1.0,
                responseMimeType: 'application/json',
            }
        });

        const text = response.text();
        console.log('--- RAW RESPONSE ---');
        console.log(text);
        return JSON.parse(text);
    }
}

// EXECUTION
(async () => {
    // We need to find a valid PDF path. 
    // In Docker, uploads are in 'd:\Dev\WeddingOS\uploads' mapped to volume?
    // Let's assume there is at least one file.
    // For this test script to work locally (on Windows host), we need to point to a valid file.
    // Let's search for a PDF in uploads.

    // NOTE: This path might need adjustment based on where the user actually stores files.
    // Based on previous logs, user is on Windows `d:\Dev\WeddingOS`.
    // Let's try to find a file in `uploads/vendors/...`

    const provider = new GeminiProviderTest();

    // Hardcoded path to a likely existing file for testing purposes
    // If this fails, I'll need to list files first.
    // Trying to find ANY pdf in the project or uploads.

    // Minimal "mock" file if no real file exists? No, Gemini needs real PDF.

    // Let's list files in `uploads` to find one.
    const uploadsRoot = path.join(__dirname, 'uploads');

    function findPdf(dir) {
        if (!fs.existsSync(dir)) return null;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                const found = findPdf(fullPath);
                if (found) return found;
            } else if (file.toLowerCase().endsWith('.pdf')) {
                return fullPath;
            }
        }
        return null;
    }

    const testFile = findPdf(path.join(__dirname, 'uploads')) || findPdf(path.join(__dirname));

    if (!testFile) {
        console.error('No PDF found to test with.');
        return;
    }

    console.log(`Found test file: ${testFile}`);

    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ensure we bypass SSL for this test too if needed
        const result = await provider.analyze(testFile, 'negotiation');
        console.log('--- NEGOTIATION HIGHLIGHTS ---');
        console.log(JSON.stringify(result.negotiationHighlights, null, 2));
    } catch (e) {
        console.error(e);
    }
})();
