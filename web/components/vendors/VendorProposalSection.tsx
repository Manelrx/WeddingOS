import React from 'react';
import { ProposalList } from './ProposalList';

interface Proposal {
    id: string;
    name: string;
    totalValue: number;
    createdAt: string;
    status: string;
}

interface VendorProposalSectionProps {
    proposals?: Proposal[];
    onProposalClick?: (proposal: Proposal) => void;
}

export function VendorProposalSection({ proposals = [], onProposalClick }: VendorProposalSectionProps) {
    if (!proposals || proposals.length === 0) {
        return null;
    }

    return (
        <section className="space-y-4 mb-10 px-6">
            <h2 className="text-xl font-serif text-text-primary px-1">Propostas</h2>
            <ProposalList proposals={proposals} onProposalClick={onProposalClick} />
        </section>
    );
}
