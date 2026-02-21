import { ProposalAnalysisResult } from '../interfaces/proposal-analysis-result.interface';
import { AiComparisonResult } from '../interfaces/ai-comparison-result.interface';

export interface AiProvider {
  /** Human-readable model name for logging and tracing. */
  readonly modelName: string;

  /**
   * Analyzes a proposal PDF and returns structured data.
   * @param input Object containing filePath and proposalId
   * @returns Promise resolving to ProposalAnalysisResult
   */
  analyzeProposal(input: { filePath: string; proposalId: string; context?: 'proposal' | 'contract' | 'negotiation' }): Promise<ProposalAnalysisResult>;

  /**
   * Compares multiple analyzed proposals and returns a comparative summary.
   * @param analyses Array of ProposalAnalysisResult objects.
   * @returns Promise resolving to AiComparisonResult
   */
  compareProposals(analyses: ProposalAnalysisResult[]): Promise<AiComparisonResult>;
}
