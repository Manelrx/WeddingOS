import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { AiProvider } from '../interfaces/ai-provider.interface';
import { ProposalAnalysisResult } from '../interfaces/proposal-analysis-result.interface';
import { IStorageProvider } from '../../storage/storage.interface';
import { ProposalAnalysisSchema } from '../schemas/proposal.schema';

@Injectable()
export class GeminiProvider implements AiProvider {
    private readonly logger = new Logger(GeminiProvider.name);
    private readonly ai: GoogleGenAI;
    public readonly modelName = 'gemini-3-flash-preview';

    constructor(
        private configService: ConfigService,
        @Inject('IStorageProvider') private storage: IStorageProvider
    ) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');

        if (!apiKey) {
            this.logger.error('GEMINI_API_KEY is not defined in environment variables');
            throw new Error('GEMINI_API_KEY is missing');
        }

        this.ai = new GoogleGenAI({ apiKey });
    }

    /**
     * Instrução de sistema em português brasileiro com regras determinísticas.
     */
    /**
     * Instrução de sistema em português brasileiro com regras determinísticas.
     */
    private buildPrompt(context: 'proposal' | 'contract' | 'negotiation' = 'proposal'): string {
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
Liste 3 a 5 pontos que podem ser usados para negociação (ex: descontos, prazos, itens extras), mesmo que não esteja explicitamente em fase de negociação. Se não houver nada óbvio, retorne null.

### contractKeyPoints
${isContract
                ? 'OBRIGATÓRIO: Liste 3 a 5 pontos CRÍTICOS para revisão jurídica. Ex: "Cláusula X permite cancelamento unilateral sem multa", "Não há definição de prazo para entrega das fotos".'
                : 'Deixe vazio ou null.'}`;
    }

    async analyzeProposal(input: { filePath: string; proposalId: string; context?: 'proposal' | 'contract' | 'negotiation' }): Promise<ProposalAnalysisResult> {
        const { filePath, proposalId, context } = input;

        try {
            this.logger.log(`Starting analysis for proposal ${proposalId} with Gemini 3 (${this.modelName})`);

            const fileBuffer = await this.storage.getFileBuffer(filePath);
            const fileSize = fileBuffer.length;
            const base64Data = fileBuffer.toString('base64');

            const response = await this.ai.models.generateContent({
                model: this.modelName,
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                inlineData: {
                                    data: base64Data,
                                    mimeType: 'application/pdf',
                                },
                            },
                            {
                                text: 'Analise esta proposta de fornecedor de casamento. Extraia todos os dados seguindo as instruções do sistema. Retorne APENAS JSON válido em português.',
                            },
                        ],
                    },
                ],
                config: {
                    systemInstruction: this.buildPrompt(context),
                    temperature: 1.0,
                    responseMimeType: 'application/json',
                    responseJsonSchema: {
                        type: 'object',
                        properties: {
                            resumo: { type: 'string' },
                            valorTotal: { type: 'number', nullable: true },
                            condicoesPagamento: { type: 'string', nullable: true },
                            pontuacaoClareza: { type: 'integer' },
                            pontuacaoConfianca: { type: 'number' },
                            riscos: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        tipo: { type: 'string', enum: ['financeiro', 'contratual', 'operacional'] },
                                        descricao: { type: 'string' },
                                        severidade: { type: 'string', enum: ['baixa', 'média', 'alta'] },
                                    },
                                    required: ['tipo', 'descricao', 'severidade'],
                                },
                            },
                            itens: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        textoOriginal: { type: 'string' },
                                        chaveNormalizada: { type: 'string' },
                                        categoria: {
                                            type: 'string',
                                            enum: [
                                                'bebidas', 'alimentação', 'decoração', 'mobiliário',
                                                'música', 'fotografia', 'filmagem', 'cerimonial',
                                                'espaço', 'iluminação', 'outros',
                                            ],
                                        },
                                        incluido: { type: 'boolean', nullable: true },
                                        observacoes: { type: 'string', nullable: true },
                                    },
                                    required: ['textoOriginal', 'chaveNormalizada', 'categoria', 'incluido'],
                                },
                            },
                            pontosFortes: { type: 'array', items: { type: 'string' } },
                            pontosFracos: { type: 'array', items: { type: 'string' } },
                            lacunasImportantes: { type: 'array', items: { type: 'string' } },
                            diferenciais: { type: 'array', items: { type: 'string' } },
                            negotiationHighlights: { type: 'array', items: { type: 'string' }, nullable: true },
                            contractKeyPoints: { type: 'array', items: { type: 'string' }, nullable: true },
                        },
                        required: [
                            'resumo', 'valorTotal', 'condicoesPagamento', 'pontuacaoClareza',
                            'pontuacaoConfianca', 'riscos', 'itens', 'pontosFortes',
                            'pontosFracos', 'lacunasImportantes', 'diferenciais',
                        ],
                    },
                    thinkingConfig: {
                        thinkingLevel: ThinkingLevel.LOW,
                    },
                },
            });

            const text = response.text;

            this.logger.debug(`Gemini 3 response for ${proposalId}: ${text}`);

            const json = JSON.parse(text);

            // Zod Validation
            const validated = ProposalAnalysisSchema.parse(json);

            return {
                ...validated,
                aiModelUsed: this.modelName,
                fileSize: fileSize,
            } as ProposalAnalysisResult;

        } catch (error) {
            this.logger.error(`Error analyzing proposal ${proposalId} with Gemini 3: ${error.message}`, error.stack);
            throw error;
        }
    }
}
