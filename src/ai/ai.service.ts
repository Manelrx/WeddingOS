
import { Injectable, Logger } from '@nestjs/common';
import { AiProvider } from './interfaces/ai-provider.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { ProposalAnalysisResult } from './interfaces/proposal-analysis-result.interface';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly provider: AiProvider;

    constructor(
        private readonly geminiProvider: GeminiProvider
    ) {
        // Hardcoded provider selection for this phase as per requirements
        this.provider = this.geminiProvider;
    }

    /**
     * Orchestrates the proposal analysis using the active provider.
     */
    async analyzeProposal(filePath: string, proposalId: string): Promise<ProposalAnalysisResult> {
        try {
            this.logger.log(`Requesting analysis for proposal ${proposalId} using GeminiProvider`);
            const result = await this.provider.analyzeProposal({ filePath, proposalId });

            this.logger.log(`Analysis completed for proposal ${proposalId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to analyze proposal ${proposalId}: ${error.message}`);
            throw error;
        }
    }
}
