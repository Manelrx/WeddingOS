import React, { useRef, useState } from 'react';
import { VendorDetail } from '@/types/vendor.types';
import { ArrowRight, Bot, CheckCircle2, AlertTriangle, FileText, UploadCloud, ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react';
import { uploadProposal, analyzeProposal, updateVendor } from '@/lib/api/vendors.api';
import { useRouter } from 'next/navigation';

interface StageNegociacaoProps {
    vendor: VendorDetail;
    onAdvance?: () => void;
}

export function StageNegociacao({ vendor, onAdvance }: StageNegociacaoProps) {
    const router = useRouter();
    const selectedProposalId = vendor.selectedProposalId;
    const selectedProposal = selectedProposalId
        ? vendor.proposals?.find(p => p.id === selectedProposalId)
        : vendor.proposals?.[0];

    // Fallback to latest if selected not found (shouldn't happen in healthy state)
    const activeProposal = selectedProposal || vendor.proposals?.[0];
    const analysis = activeProposal?.analysis;
    const [isUploading, setIsUploading] = useState(false);
    const [isReanalyzing, setIsReanalyzing] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [expandedAnalysis, setExpandedAnalysis] = useState(true);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setStatusMessage('Enviando minuta...');

            // 1. Upload new proposal
            const newProposal = await uploadProposal(vendor.id, file, 'contract');

            // 2. Set as selected proposal for this vendor
            await updateVendor(vendor.id, { selectedProposalId: newProposal.id });

            setStatusMessage('Minuta atualizada! Processando análise...');

            // Short delay to allow backend to propagate/start job
            setTimeout(() => {
                setStatusMessage(null);
                router.refresh();
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            setStatusMessage('Erro ao enviar arquivo.');
            setTimeout(() => setStatusMessage(null), 3000);
        } finally {
            setIsUploading(false);
        }
    };

    const handleReanalyze = async () => {
        if (!activeProposal) return;

        try {
            setIsReanalyzing(true);
            setStatusMessage('Solicitando nova análise...');

            await analyzeProposal(activeProposal.id, 'negotiation');

            setStatusMessage('Análise em andamento...');
            setTimeout(() => {
                setStatusMessage(null);
                router.refresh();
            }, 2000);
        } catch (error) {
            console.error('Re-analysis error:', error);
            setStatusMessage('Erro na solicitação.');
            setTimeout(() => setStatusMessage(null), 3000);
        } finally {
            setIsReanalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">
                        Mesa de Negociação
                    </h2>
                    <p className="text-text-secondary max-w-xl leading-relaxed">
                        Este é o momento de refinar os detalhes. Utilize a IA para analisar minutas de contrato, identificar cláusulas abusivas e garantir o melhor acordo.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="group flex items-center gap-3 px-6 py-3 bg-white border border-dashed border-gold-dark/30 rounded-xl hover:border-gold-dark hover:bg-gold-light/5 transition-all shadow-sm"
                        >
                            <div className="p-2 bg-gold-light/10 text-gold-dark rounded-lg group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block text-xs font-bold text-gold-darker uppercase tracking-wider">
                                    {isUploading ? 'Enviando...' : 'Upload de Minuta'}
                                </span>
                                <span className="block text-[10px] text-text-tertiary">PDF, Máx 10MB</span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileUpload}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Message Toast */}
            {statusMessage && (
                <div className="fixed top-24 right-6 z-50 animate-slide-in-right bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-gold-primary" />
                    <span className="text-sm font-medium">{statusMessage}</span>
                </div>
            )}

            {/* Smart Analysis Card */}
            {analysis ? (
                <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
                    {/* IA Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex flex-wrap items-center justify-between text-white gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Bot className="w-6 h-6 text-gold-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Análise da Proposta Vigente</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                    <span className="bg-slate-700/50 px-2 py-0.5 rounded text-gold-primary font-medium">Gemini 3.0 Pro</span>
                                    <span>•</span>
                                    <span>Atualizado em {activeProposal?.createdAt ? new Date(activeProposal.createdAt).toLocaleDateString() : 'Hoje'}</span>
                                    {analysis.negotiationHighlights && <span className="bg-indigo-500/20 text-indigo-200 px-1.5 rounded text-[10px]">Estratégia Ativa</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReanalyze}
                                disabled={isReanalyzing}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                title="Refazer anlálise para obter novas estratégias"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin' : ''}`} />
                                {isReanalyzing ? 'Analisando...' : 'Atualizar Análise'}
                            </button>
                            <button
                                onClick={() => setExpandedAnalysis(!expandedAnalysis)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {expandedAnalysis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {expandedAnalysis && (
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Negotiation Strategies - Special for this stage */}
                            <div className="col-span-1 md:col-span-2">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-700 uppercase tracking-wider mb-4 border-b border-indigo-100 pb-2">
                                    <Bot className="w-4 h-4" /> Estratégias de Negociação
                                </h4>
                                <ul className="space-y-3">
                                    {analysis.negotiationHighlights?.length ? analysis.negotiationHighlights.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                            {item}
                                        </li>
                                    )) : (
                                        <li className="text-gray-400 text-sm italic">Nenhuma estratégia específica gerada (ainda). Clique em Atualizar Análise.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Strengths */}
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-wider mb-4 border-b border-green-100 pb-2">
                                    <CheckCircle2 className="w-4 h-4" /> Pontos Fortes
                                </h4>
                                <ul className="space-y-3">
                                    {analysis.strengths?.length ? analysis.strengths.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                            {item}
                                        </li>
                                    )) : (
                                        <li className="text-gray-400 text-sm italic">Nenhum ponto forte destacado.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Weaknesses / Risks */}
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-wider mb-4 border-b border-amber-100 pb-2">
                                    <AlertTriangle className="w-4 h-4" /> Pontos de Atenção & Riscos
                                </h4>
                                <ul className="space-y-3">
                                    {/* Combine Weaknesses and Risks for a comprehensive list */}
                                    {[...(analysis.weaknesses || []), ...(analysis.risks?.map(r => r.descricao) || [])].slice(0, 5).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                    {(!analysis.weaknesses?.length && !analysis.risks?.length) && (
                                        <li className="text-gray-400 text-sm italic">Nenhum risco crítico identificado.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Financial Summary */}
                            <div className="md:col-span-2 mt-4 pt-6 border-t border-stone-100 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor da Proposta</span>
                                    <div className="text-2xl font-serif font-bold text-text-primary mt-1">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(activeProposal?.totalValue || 0)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score de Confiança</span>
                                    <div className="flex items-center justify-end gap-2 mt-1">
                                        <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${analysis.confidenceScore > 0.8 ? 'bg-green-500' : 'bg-amber-500'}`}
                                                style={{ width: `${(analysis.confidenceScore || 0) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-text-primary">{Math.round((analysis.confidenceScore || 0) * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-10 border border-stone-100 text-center shadow-sm">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-stone-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Nenhuma proposta em análise</h3>
                    <p className="text-text-secondary mb-6 max-w-sm mx-auto">
                        Faça o upload da minuta do contrato ou da proposta revisada para que a IA possa analisar os termos.
                    </p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2.5 bg-gold-primary text-white rounded-xl font-medium shadow-lg shadow-gold-primary/20 hover:bg-gold-hover transition-colors"
                    >
                        Fazer Upload
                    </button>
                </div>
            )}

            {/* Compare Banner with Upload Button */}
            <div className="bg-ivory rounded-2xl p-6 border border-gold-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gold-dark">
                        <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary">Precisa de ajustes na minuta?</h3>
                        <p className="text-sm text-text-secondary">Envie a nova versão para re-análise automática dos termos.</p>
                    </div>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-2.5 bg-white border border-gold-primary/30 text-gold-darker rounded-xl font-bold text-sm hover:bg-gold-light/10 transition-colors shadow-sm"
                >
                    {isUploading ? 'Enviando...' : 'Enviar Nova Versão'}
                </button>
            </div>

            {/* Advance Action - Floating Footer */}
            {onAdvance && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50 md:sticky md:bottom-4 md:bg-transparent md:border-none md:backdrop-blur-none pointer-events-none md:pointer-events-auto">
                    <div className="max-w-4xl mx-auto flex justify-end pointer-events-auto">
                        <button
                            onClick={onAdvance}
                            className="w-full md:w-auto px-8 py-4 bg-gold-primary text-white rounded-xl font-bold shadow-xl shadow-gold-primary/20 hover:bg-gold-dark hover:transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                            <span>Finalizar Negociação</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
            {/* Spacer for floating footer */}
            <div className="h-24 md:h-0" />
        </div>
    );
}
