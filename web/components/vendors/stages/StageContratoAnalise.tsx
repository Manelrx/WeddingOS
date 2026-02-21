import React, { useState, useRef } from 'react';
import { VendorDetail } from '@/types/vendor.types';
import { toast } from 'sonner';
import { ShieldAlert, FileCheck, Search, UploadCloud, FileText, Calendar, RotateCcw, XCircle, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';
import { uploadProposal } from '@/lib/api/vendors.api';
import { useRouter } from 'next/navigation';
import { ProposalRiskSection } from '../ProposalRiskSection';

interface StageContratoAnaliseProps {
    vendor: VendorDetail;
    onAnalyze: (proposal: VendorDetail['proposals'][0]) => void;
    onAdvance?: () => void;
}

export function StageContratoAnalise({ vendor, onAnalyze, onAdvance }: StageContratoAnaliseProps) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Find the latest proposal or one specifically marked as contract if we had that flag.
    // For now, we assume the latest proposal in THIS stage context is the contract.
    // Or users upload a new file which becomes the contract.
    // If the vendor is in 'CONTRATO_EM_ANALISE', the active proposal should be the contract.
    const activeProposal = vendor.proposals?.[0];
    const analysis = activeProposal?.analysis;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            // Upload with context 'contract'
            const newProposal = await uploadProposal(vendor.id, file, 'contract');
            toast.success('Contrato enviado! Iniciando análise jurídica...');

            // Trigger analysis immediately
            onAnalyze(newProposal as any);
            router.refresh();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Erro ao enviar contrato.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleReanalyze = () => {
        if (activeProposal) {
            onAnalyze(activeProposal);
        }
    };

    if (!activeProposal) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-primary to-amber-500" />

                    <div className="text-center max-w-lg mx-auto py-12">
                        <div className="w-20 h-20 bg-amber-50 text-gold-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Scale className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-gray-900 mb-3">Análise de Contrato</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Envie a minuta do contrato para que nossa IA identifique <strong className="text-gold-dark">cláusulas abusivas</strong>, <strong className="text-gold-dark">multas</strong> e <strong className="text-gold-dark">riscos jurídicos</strong> antes de você assinar.
                        </p>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full py-6 border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center hover:bg-stone-50 hover:border-gold-primary/50 transition-all group cursor-pointer bg-white relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gold-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <UploadCloud className="w-10 h-10 text-stone-400 group-hover:scale-110 group-hover:text-gold-primary transition-all mb-3 relative z-10" />
                            <span className="font-semibold text-gray-700 group-hover:text-gold-dark text-lg relative z-10">
                                {isUploading ? 'Enviando...' : 'Clique para enviar o PDF do Contrato'}
                            </span>
                            <span className="text-sm text-stone-400 mt-1 relative z-10">Aceitamos PDF de até 10MB</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Análise Jurídica</h2>
                    <p className="text-gray-500 text-sm">Revisão automática de cláusulas e riscos.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <UploadCloud className="w-4 h-4" />
                        <span>Substituir Arquivo</span>
                    </button>
                    {!analysis && (
                        <button
                            onClick={handleReanalyze}
                            className="flex items-center gap-2 px-4 py-2 bg-gold-primary text-white rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors shadow-md shadow-gold-primary/20"
                        >
                            <Search className="w-4 h-4" />
                            <span>Analisar Agora</span>
                        </button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            {/* Main Content */}
            {analysis ? (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 bg-amber-50 text-gold-dark rounded-2xl">
                                <Scale className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Resumo da Análise</h3>
                                <p className="text-gray-500 mt-1 max-w-2xl">{analysis.summary}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-24 md:pb-0">
                            {/* Risks Section */}
                            <ProposalRiskSection risks={analysis.risks || []} />

                            {/* Contract Key Points (Using generic insights or custom list) */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                    <FileCheck className="w-4 h-4 text-gold-dark" />
                                    Pontos de Atenção
                                </h4>
                                {analysis.contractKeyPoints && analysis.contractKeyPoints.length > 0 ? (
                                    <ul className="space-y-3">
                                        {analysis.contractKeyPoints.map((point, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 bg-amber-50/30 rounded-xl border border-amber-100/50">
                                                <CheckCircle2 className="w-4 h-4 text-gold-dark mt-0.5 shrink-0" />
                                                <span className="text-sm text-gray-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                                        <p className="text-gray-400 text-sm">Nenhum ponto específico destacado.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Footer - Floating */}
                        {onAdvance && (
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50 md:sticky md:bottom-4 md:bg-transparent md:border-none md:backdrop-blur-none pointer-events-none md:pointer-events-auto">
                                <div className="max-w-4xl mx-auto flex justify-end pointer-events-auto">
                                    <button
                                        onClick={onAdvance}
                                        className="w-full md:w-auto px-8 py-4 bg-gold-primary text-white rounded-xl font-bold shadow-xl shadow-gold-primary/20 hover:bg-gold-dark transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileCheck className="w-5 h-5" />
                                        <span>Aprovar Contrato e Finalizar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : activeProposal.status === 'FAILED' ? (
                <div className="bg-red-50 rounded-3xl p-12 text-center border border-red-100">
                    <div className="bg-red-100 text-red-600 mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-red-900">Falha na Análise do Contrato</h3>
                    <p className="text-red-700 mt-2 mb-6 max-w-md mx-auto text-sm">
                        Ocorreu um erro ao processar o contrato. Verifique se o arquivo não está protegido por senha.
                    </p>
                    <button
                        onClick={handleReanalyze}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200/50 flex items-center justify-center gap-2 mx-auto"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Tentar Novamente
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                    <div className="bg-amber-50 text-gold-primary mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Aguardando Análise</h3>
                    <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                        O contrato <strong>{activeProposal.name}</strong> está na fila ou pendente de envio para IA.
                    </p>
                    <button
                        onClick={handleReanalyze}
                        className="px-6 py-2.5 bg-gold-primary text-white rounded-full font-medium hover:bg-gold-dark transition-colors shadow-lg shadow-gold-primary/20"
                    >
                        Iniciar Análise
                    </button>
                </div>
            )}
        </div>
    );
}
