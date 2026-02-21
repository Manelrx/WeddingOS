import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { VendorDetail } from '@/types/vendor.types';
import { ProposalInsightsSection } from '../ProposalInsightsSection';
import { ProposalRiskSection } from '../ProposalRiskSection';
import { ProposalItemsSection } from '../ProposalItemsSection';
import { Sparkles, Calendar, ArrowRight, Plus, FileText, UploadCloud, ChevronRight, RotateCcw, XCircle } from 'lucide-react';
import { uploadProposal } from '@/lib/api/vendors.api';
import { useRouter } from 'next/navigation';

interface StageOrcamentoProps {
    vendor: VendorDetail;
    onAnalyze: (proposal: VendorDetail['proposals'][0]) => void;
    onPromote?: (proposalId: string) => void;
}

export function StageOrcamento({ vendor, onAnalyze, onPromote }: StageOrcamentoProps) {
    const router = useRouter();
    const [activeProposalId, setActiveProposalId] = useState<string | null>(vendor.proposals?.[0]?.id || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeProposal = vendor.proposals?.find(p => p.id === activeProposalId) || vendor.proposals?.[0];
    const analysis = activeProposal?.analysis;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const newProposal = await uploadProposal(vendor.id, file, 'proposal');
            toast.success('Orçamento enviado! Iniciando análise automática...');
            setActiveProposalId(newProposal.id);
            onAnalyze(newProposal as any); // Auto-trigger analysis
            router.refresh();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Erro ao enviar arquivo.');
        } finally {
            setIsUploading(false);
        }
    };

    if (!vendor.proposals || vendor.proposals.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="bg-amber-50 text-amber-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum orçamento encontrado</h3>
                <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
                    Adicione o primeiro orçamento para iniciar a análise comparativa.
                </p>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-3 bg-gold-primary text-white rounded-full font-bold shadow-lg hover:bg-gold-dark transition-all"
                >
                    {isUploading ? 'Enviando...' : 'Adicionar Orçamento'}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Proposals Carousel / List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-serif font-bold text-gray-900">Orçamentos Recebidos</h3>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 text-sm font-bold text-gold-dark hover:text-gold-darker transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Novo Orçamento</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileUpload}
                    />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                    {vendor.proposals.map((proposal) => {
                        const isActive = proposal.id === activeProposal?.id;
                        return (
                            <button
                                key={proposal.id}
                                onClick={() => setActiveProposalId(proposal.id)}
                                className={`
                                    snap-center shrink-0 w-64 p-4 rounded-2xl border transition-all text-left group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-100'
                                        : 'bg-white border-gray-100 hover:border-gold-primary/30 hover:shadow-md'
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/10 text-gold-primary' : 'bg-gray-50 text-gray-400'}`}>
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    {isActive && <div className="px-2 py-1 bg-gold-primary text-white text-[10px] font-bold uppercase rounded-full">Ativo</div>}
                                </div>
                                <h4 className={`font-bold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                    {proposal.name || 'Orçamento Sem Nome'}
                                </h4>
                                <p className={`text-sm mt-1 ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.totalValue || 0)}
                                </p>
                                <div className={`text-xs mt-3 flex items-center gap-1 ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <Calendar className="w-3 h-3" />
                                    {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Proposal Analysis */}
            {activeProposal && analysis ? (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
                                    Análise Completa
                                </span>
                            </div>
                            <h2 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(activeProposal.totalValue || 0)}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Valor identificado na proposta</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <ProposalRiskSection risks={analysis.risks || []} />
                        <ProposalInsightsSection
                            strengths={analysis.strengths || []}
                            weaknesses={analysis.weaknesses || []}
                            gaps={analysis.gaps || []}
                            differentiators={analysis.diferenciais}
                        />
                    </div>

                    <div className="mt-8">
                        <ProposalItemsSection items={analysis.itens || analysis.items || []} />
                    </div>

                    {/* Action Footer - Floating */}
                    {onPromote && (
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50 md:sticky md:bottom-4 md:bg-transparent md:border-none md:backdrop-blur-none pointer-events-none md:pointer-events-auto">
                            <div className="max-w-4xl mx-auto flex justify-end pointer-events-auto">
                                <button
                                    onClick={() => onPromote(activeProposal.id)}
                                    className="w-full md:w-auto px-6 py-4 bg-gold-primary text-white rounded-xl font-bold shadow-xl shadow-gold-primary/20 hover:bg-gold-dark transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Escolher e Negociar</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : activeProposal ? (
                // CHECK FOR FAILED STATUS
                activeProposal.status === 'FAILED' ? (
                    <div className="bg-red-50 rounded-3xl p-12 text-center border border-red-100">
                        <div className="bg-red-100 text-red-600 mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-red-900">Falha na Análise</h3>
                        <p className="text-red-700 mt-2 mb-6 max-w-md mx-auto text-sm">
                            Ocorreu um erro ao processar este documento: <br />
                            <span className="font-mono bg-red-100/50 px-2 py-1 rounded text-red-800 mt-2 block break-words">
                                {activeProposal.errorMessage || 'Erro desconhecido'}
                            </span>
                        </p>
                        <button
                            onClick={() => onAnalyze(activeProposal)}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200/50 flex items-center justify-center gap-2 mx-auto"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Tentar Novamente
                        </button>
                    </div>
                ) : (
                    // PENDING STATE (Default)
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                        <div className="bg-blue-50 text-blue-600 mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Análise Pendente</h3>
                        <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                            Ainda não analisamos a proposta <strong>{activeProposal.name}</strong>.
                        </p>
                        <button
                            onClick={() => onAnalyze(activeProposal)}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-colors shadow-lg shadow-gray-200/50"
                        >
                            Analisar com IA
                        </button>
                    </div>
                )
            ) : null}

            {/* Spacer for floating footer */}
            {activeProposal && <div className="h-24 md:h-0" />}
        </div>
    );
}
