import React from 'react';
import { VendorDetail } from '@/types/vendor.types';
import { ProposalInsightsSection } from '../ProposalInsightsSection';
import { ProposalRiskSection } from '../ProposalRiskSection';
import { ProposalItemsSection } from '../ProposalItemsSection';
import { Sparkles, AlertCircle, Calendar } from 'lucide-react';

interface StageOrcamentoProps {
    vendor: VendorDetail;
    onAnalyze: (proposal: VendorDetail['proposals'][0]) => void;
}

export function StageOrcamento({ vendor, onAnalyze }: StageOrcamentoProps) {
    // Get the latest proposal (or the one being analyzed/viewed)
    // For now, let's assume we want to show the most recent one or a selected one.
    // Ideally, the parent component manages the selected proposal state.
    // But for the stage view, users usually care about the *latest* relevant proopsal.

    const latestProposal = vendor.proposals?.[0];

    if (!latestProposal) {
        return (
            <div className="text-center py-12 px-4">
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl inline-block mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum orçamento encontrado</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                    Adicione uma proposta para iniciar a análise de orçamento.
                </p>
            </div>
        );
    }

    const { analysis } = latestProposal;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Main Value */}
            {analysis && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
                                    Orçamento Analisado
                                </span>
                                {vendor.proposalValidUntil && (
                                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                        <Calendar className="w-3 h-3" />
                                        Válido até {new Date(vendor.proposalValidUntil).toLocaleDateString('pt-BR')}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(latestProposal.totalValue || 0)}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Valor total estimado</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-gray-400 font-medium uppercase tracking-wider text-[10px]">Clareza</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${analysis.clarityScore}%` }}
                                        />
                                    </div>
                                    <span className="font-semibold text-gray-700">{analysis.clarityScore}%</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-gray-400 font-medium uppercase tracking-wider text-[10px]">Confiança IA</span>
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-accent-gold" />
                                    <span className="font-semibold text-gray-700">{Math.round((analysis.confidenceScore || 0) * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {analysis.summary}
                        </p>
                    </div>
                </div>
            )}

            {!analysis && (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                    <div className="bg-blue-50 text-blue-600 mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Análise Pendente</h3>
                    <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                        Ainda não analisamos este orçamento com nossa IA. Clique abaixo para extrair insights automáticos.
                    </p>
                    <button
                        onClick={() => onAnalyze(latestProposal)}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-colors shadow-lg shadow-gray-200/50"
                    >
                        Analisar com IA
                    </button>
                </div>
            )}

            {/* Analysis Sections */}
            {analysis && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProposalRiskSection risks={analysis.risks || []} />
                        <ProposalInsightsSection
                            strengths={analysis.strengths || []}
                            weaknesses={analysis.weaknesses || []}
                            gaps={analysis.gaps || []}
                            differentiators={analysis.diferenciais}
                        />
                    </div>

                    <ProposalItemsSection items={analysis.itens || analysis.items || []} />
                </>
            )}
        </div>
    );
}
