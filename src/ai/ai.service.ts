
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider } from './interfaces/ai-provider.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { ProposalAnalysisResult } from './interfaces/proposal-analysis-result.interface';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly provider: AiProvider;

    constructor(
        private readonly configService: ConfigService,
        private readonly geminiProvider: GeminiProvider,
        // Future providers can be injected here:
        // private readonly openAIProvider: OpenAIProvider,
        // private readonly claudeProvider: ClaudeProvider,
    ) {
        const selectedProvider = this.configService.get<string>('AI_PROVIDER', 'gemini');

        switch (selectedProvider) {
            case 'gemini':
                this.provider = this.geminiProvider;
                break;
            // case 'openai':
            //     this.provider = this.openAIProvider;
            //     break;
            // case 'claude':
            //     this.provider = this.claudeProvider;
            //     break;
            default:
                this.logger.warn(`Unknown AI_PROVIDER "${selectedProvider}", falling back to Gemini`);
                this.provider = this.geminiProvider;
        }

        this.logger.log(`AI Provider initialized: ${this.provider.modelName} (${selectedProvider})`);
    }

    /**
     * Orchestrates the proposal analysis using the active provider.
     */
    async analyzeProposal(filePath: string, proposalId: string, context?: 'proposal' | 'contract' | 'negotiation'): Promise<ProposalAnalysisResult> {
        try {
            this.logger.log(`Requesting analysis for proposal ${proposalId} using ${this.provider.modelName} (context: ${context || 'default'})`);
            const result = await this.provider.analyzeProposal({ filePath, proposalId, context });

            this.logger.log(`Analysis completed for proposal ${proposalId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to analyze proposal ${proposalId}: ${error.message}`);
            throw error;
        }
    }
}
