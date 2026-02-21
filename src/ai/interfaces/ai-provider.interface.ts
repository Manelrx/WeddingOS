
import { ProposalAnalysisResult } from '../interfaces/proposal-analysis-result.interface';

export interface AiProvider {
  /** Human-readable model name for logging and tracing. */
  readonly modelName: string;

  /**
   * Analyzes a proposal PDF and returns structured data.
   * @param input Object containing filePath and proposalId
   * @returns Promise resolving to ProposalAnalysisResult
   */
  analyzeProposal(input: { filePath: string; proposalId: string; context?: 'proposal' | 'contract' | 'negotiation' }): Promise<ProposalAnalysisResult>;
}
