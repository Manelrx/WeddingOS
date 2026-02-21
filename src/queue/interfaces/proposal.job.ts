export interface ProposalJobPayload {
    proposalId: string;
    vendorId: string;
    filePath: string;
    createdAt: string;
    version: 'v1';
    context?: 'proposal' | 'contract' | 'negotiation';
}
