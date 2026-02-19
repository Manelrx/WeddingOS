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
    private buildPrompt(): string {
        return `Você é o Analisador de Propostas do WeddingOS, um motor determinístico de extração de dados.
Sua tarefa é extrair dados estruturados de um PDF de proposta de fornecedor de casamento.

## REGRAS ABSOLUTAS

1. NUNCA assuma, infira ou estime qualquer dado. Extraia APENAS o que está explicitamente escrito.
2. Se um valor não estiver explicitamente declarado no documento, retorne null. NÃO adivinhe.
3. Retorne APENAS JSON válido. Sem markdown, sem explicações, sem comentários fora do JSON.
4. Separe extração factual de interpretação. Fatos vão nos itens. Interpretação vai nos riscos.
5. Retorne o JSON exclusivamente em português. Não utilize termos em inglês.
6. Não traduza nomes próprios ou marcas (ex: "Heineken", "Red Label" mantêm-se como estão).
7. Não converta valores monetários para outra moeda. Mantenha o valor original em reais (BRL).
8. Considere o contexto jurídico brasileiro ao classificar riscos contratuais.

## INSTRUÇÕES DE EXTRAÇÃO

### resumo
Escreva um resumo factual de 2-3 frases sobre o que esta proposta oferece. NÃO editorialize.

### valorTotal
Extraia o valor monetário total como número (ex: 15000.00).
- Se existirem múltiplos pacotes, use o mais proeminentemente apresentado.
- Se nenhum valor total estiver explicitamente declarado, retorne null.
- NÃO some itens individuais para estimar um total.

### condicoesPagamento
Extraia as condições de pagamento exatamente como descritas (ex: "50% na assinatura, 50% 30 dias antes do evento").
- Se não houver condições de pagamento mencionadas, retorne null.

### pontuacaoClareza (0–100)
Avalie quão claro, completo e sem ambiguidades o documento é:
- 90-100: Todos os itens, preços, termos e condições estão explicitamente declarados.
- 70-89: A maioria das informações está clara, lacunas menores.
- 50-69: Várias ambiguidades ou detalhes ausentes.
- 0-49: Muito vago, faltando informações críticas.

### pontuacaoConfianca (0–1)
Avalie SUA confiança na precisão da sua própria extração:
- 0.9-1.0: Todos os dados extraídos são claramente legíveis e sem ambiguidades.
- 0.7-0.89: A maioria dos dados é clara, alguns campos exigiram interpretação.
- 0.5-0.69: Documento parcialmente ilegível, alguns campos podem estar imprecisos.
- 0.0-0.49: Documento muito difícil de ler ou majoritariamente ilegível.

### riscos
Classifique cada risco em exatamente um dos três tipos:
- "financeiro": Custos ocultos, ambiguidade de preço, breakdown ausente.
- "contratual": Termos vagos de cancelamento, responsabilidades indefinidas, prazos ausentes.
- "operacional": Lacunas logísticas, entrega indefinida, cronograma ausente.

Severidade:
- "baixa": Inconveniência menor, facilmente resolvível.
- "média": Pode causar disputas ou custos inesperados.
- "alta": Exposição financeira ou legal significativa.

IMPORTANTE: Detecte linguagem contratual vaga. Se encontrar termos como:
- "a combinar"
- "conforme disponibilidade"
- "poderá ser ajustado"
- "sujeito a alteração"
- "valores estimados"
- "sob consulta"

Você DEVE adicionar um risco do tipo "contratual" com severidade "média" descrevendo a ambiguidade encontrada.

### itens
Para cada item ou serviço mencionado na proposta:
- "textoOriginal": O texto exato como aparece no documento (manter nomes próprios e marcas).
- "chaveNormalizada": Uma chave genérica em minúsculas para comparação entre propostas.
  Exemplos:
    "Whisky Red Label" → chaveNormalizada: "whisky"
    "Cerveja Heineken" → chaveNormalizada: "cerveja"
    "Mesa de doces finos" → chaveNormalizada: "doces"
    "DJ com iluminação" → chaveNormalizada: "dj"
    "Buffet completo para 200 pessoas" → chaveNormalizada: "buffet"
    "Decoração floral premium" → chaveNormalizada: "decoracao"
    "Fotógrafo + Making of" → chaveNormalizada: "fotografia"
    "Filmagem aérea com drone" → chaveNormalizada: "filmagem"
    "Mestre de cerimônia" → chaveNormalizada: "cerimonial"
    "Salão de festas" → chaveNormalizada: "espaco"
    "Iluminação cênica" → chaveNormalizada: "iluminacao"
    "Cadeiras Tiffany" → chaveNormalizada: "mobiliario"
- "categoria": DEVE ser uma das seguintes categorias controladas:
    "bebidas", "alimentação", "decoração", "mobiliário", "música",
    "fotografia", "filmagem", "cerimonial", "espaço", "iluminação", "outros"
  Se não tiver certeza da categoria, use "outros".
- "incluido": true se explicitamente incluído, false se explicitamente excluído, null se não claramente declarado.
- "observacoes": Qualquer detalhe relevante sobre limitações, quantidades ou condições. null se não houver.

### pontosFortes
Liste 3-5 aspectos positivos que destacam esta proposta (ex: custo-benefício, inclusão de itens premium, flexibilidade).

### pontosFracos
Liste 3-5 aspectos negativos ou limitações (ex: curto prazo de pagamento, taxas extras, ausência de itens comuns).

### lacunasImportantes
Liste informações cruciais que NÃO foram encontradas na proposta (ex: taxa de deslocamento, hora extra, cardápio detalhado).

### diferenciais
Liste itens ou serviços únicos que este fornecedor oferece comparado à média do mercado.`;
    }

    async analyzeProposal(input: { filePath: string; proposalId: string }): Promise<ProposalAnalysisResult> {
        const { filePath, proposalId } = input;

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
                    systemInstruction: this.buildPrompt(),
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
