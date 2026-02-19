import React from 'react';
import { VendorDetail } from '@/types/vendor.types';
import { ArrowRight, Edit3, MessageCircle, FileText } from 'lucide-react';
import { ProposalInsightsSection } from '../ProposalInsightsSection';

interface StageNegociacaoProps {
    vendor: VendorDetail;
}

export function StageNegociacao({ vendor }: StageNegociacaoProps) {
    const latestProposal = vendor.proposals?.[0];
    const analysis = latestProposal?.analysis;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Negotiation Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />

                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-display font-semibold text-gray-900">Fase de Negociação</h2>
                        <p className="text-gray-500 mt-2 max-w-xl">
                            Agora é o momento de ajustar valores e esclarecer os pontos fracos. Use os insights abaixo para guiar sua conversa.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors">
                            <Edit3 className="w-4 h-4" />
                            Editar Notas
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Valor Proposto</span>
                        <div className="text-xl font-bold text-gray-900 mt-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(latestProposal?.totalValue || 0)}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Pontos de Atenção</span>
                        <div className="text-xl font-bold text-amber-600 mt-1">
                            {(analysis?.weaknesses?.length || 0) + (analysis?.gaps?.length || 0)}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Diferenciais</span>
                        <div className="text-xl font-bold text-emerald-600 mt-1">
                            {(analysis?.diferenciais?.length || 0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Negotiation Insights */}
            {analysis && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-indigo-500" />
                        O que discutir?
                    </h3>

                    <div className="space-y-6">
                        {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-red-600 uppercase tracking-wider mb-3">Pontos Fracos</h4>
                                <ul className="space-y-2">
                                    {analysis.weaknesses.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600 text-sm bg-red-50/50 p-3 rounded-lg">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {analysis.gaps && analysis.gaps.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-amber-600 uppercase tracking-wider mb-3">Lacunas no Orçamento</h4>
                                <ul className="space-y-2">
                                    {analysis.gaps.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600 text-sm bg-amber-50/50 p-3 rounded-lg">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(!analysis.weaknesses?.length && !analysis.gaps?.length) && (
                            <p className="text-gray-500 text-center py-6">
                                Nenhuma lacuna ou ponto fraco crítico identificado. A proposta parece sólida!
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Compare with others CTA */}
            {/* This would link to comparison view */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg shadow-indigo-900/20">
                <div>
                    <h3 className="font-semibold text-lg">Comparar Propostas</h3>
                    <p className="text-indigo-200 text-sm max-w-md mt-1">
                        Veja como este fornecedor se compara com as outras opções em Clareza, Preço e Riscos.
                    </p>
                </div>
                <button className="px-5 py-2 bg-white text-indigo-900 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2">
                    Ver Comparativo <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
