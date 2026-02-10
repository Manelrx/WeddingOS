
import { Injectable } from '@nestjs/common';
import { ProposalAnalysisResult } from '../interfaces/proposal-analysis-result.interface';

export interface AiProvider {
  /**
   * Analyzes a proposal PDF and returns structured data.
   * @param input Object containing filePath and proposalId
   * @returns Promise resolving to ProposalAnalysisResult
   */
  analyzeProposal(input: {
    filePath: string;
    proposalId: string;
  }): Promise<ProposalAnalysisResult>;
}
