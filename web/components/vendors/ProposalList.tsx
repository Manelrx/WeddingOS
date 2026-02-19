"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Download, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzeProposal } from '@/lib/api/vendors.api';
import { useRouter } from 'next/navigation';

interface Proposal {
    id: string;
    name: string;
    totalValue: number;
    createdAt: string;
    status: string;
}

interface ProposalListProps {
    proposals: Proposal[];
    onProposalClick?: (proposal: Proposal) => void;
}

export function ProposalList({ proposals, onProposalClick }: ProposalListProps) {
    const router = useRouter();
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
    const [statuses, setStatuses] = useState<Record<string, string>>({});

    // Initialize statuses from props
    useEffect(() => {
        const initialStatuses: Record<string, string> = {};
        proposals.forEach(p => {
            initialStatuses[p.id] = p.status;
            if (p.status === 'PROCESSING') {
                setProcessingIds(prev => new Set(prev).add(p.id));
            }
        });
        setStatuses(initialStatuses);
    }, [proposals]);

    // Polling logic
    useEffect(() => {
        if (processingIds.size === 0) return;

        const interval = setInterval(() => {
            router.refresh(); // Refresh server data to check status updates
        }, 5000);

        return () => clearInterval(interval);
    }, [processingIds, router]);

    // Update processing IDs based on new props from refresh
    useEffect(() => {
        const newProcessingIds = new Set<string>();
        proposals.forEach(p => {
            // Update local status map
            setStatuses(prev => ({ ...prev, [p.id]: p.status }));

            if (p.status === 'PROCESSING') {
                newProcessingIds.add(p.id);
            }
        });
        setProcessingIds(newProcessingIds);
    }, [proposals]);

    const handleAnalyze = async (proposalId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            // Optimistic update
            setStatuses(prev => ({ ...prev, [proposalId]: 'PROCESSING' }));
            setProcessingIds(prev => new Set(prev).add(proposalId));

            await analyzeProposal(proposalId);
            router.refresh();
        } catch (error) {
            console.error("Analysis trigger failed:", error);
            // Revert on error (or show error state)
            setStatuses(prev => ({ ...prev, [proposalId]: 'FAILED' }));
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(proposalId);
                return next;
            });
            alert("Falha ao iniciar análise.");
        }
    };

    if (!proposals || proposals.length === 0) return null;

    return (
        <div className="space-y-3">
            {proposals.map((proposal) => {
                const status = statuses[proposal.id] || proposal.status;
                const isProcessing = status === 'PROCESSING';
                const isPending = status === 'PENDING';
                const isFailed = status === 'FAILED' || status === 'QUEUE_FAILED';
                const isSuccess = status === 'SUCCESS';

                return (
                    <div
                        key={proposal.id}
                        onClick={() => onProposalClick?.(proposal)}
                        className={cn(
                            "bg-background-card border border-divider rounded-2xl p-4 shadow-soft",
                            "hover:border-accent-gold/30 transition-all cursor-pointer group flex items-center gap-4 relative overflow-hidden"
                        )}>
                        {/* Status Indicator Bar */}
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1",
                            isProcessing && "bg-accent-gold/50 animate-pulse",
                            isSuccess && "bg-green-500",
                            isFailed && "bg-red-500",
                            isPending && "bg-stone-300"
                        )} />

                        <div className={cn(
                            "w-12 h-12 rounded-xl bg-background-warm flex items-center justify-center shrink-0 border border-divider",
                            "group-hover:bg-amber-50 group-hover:border-accent-gold/20 transition-colors"
                        )}>
                            <FileText className="w-6 h-6 text-text-secondary group-hover:text-accent-gold transition-colors" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-sans font-medium text-text-primary truncate">{proposal.name}</h3>
                                {isProcessing && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-100/50">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Analisando...
                                    </span>
                                )}
                                {isFailed && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-medium border border-red-100/50">
                                        <AlertCircle className="w-3 h-3" />
                                        Falha
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-text-muted mt-1">
                                {new Date(proposal.createdAt).toLocaleDateString('pt-BR')} • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.totalValue)}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {(isPending || isFailed) && (
                                <button
                                    onClick={(e) => handleAnalyze(proposal.id, e)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-warm hover:bg-gold-primary hover:text-white text-text-secondary transition-all text-xs font-medium group/btn shadow-sm"
                                    title="Analisar com IA"
                                >
                                    <Sparkles className="w-3.5 h-3.5 group-hover/btn:animate-pulse" />
                                    <span className="hidden sm:inline">Analisar</span>
                                </button>
                            )}

                            <button className="p-2 rounded-full hover:bg-background-warm text-text-secondary hover:text-accent-gold transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
