"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProposalActionModal } from './ProposalActionModal';
import { VendorNavbar } from './VendorNavbar';
import { VendorEditModal } from './VendorEditModal';
import { VendorDetail } from '@/types/vendor.types';
import { StageOrcamento } from './stages/StageOrcamento';
import { StageNegociacao } from './stages/StageNegociacao';
import { StageContratoAnalise } from './stages/StageContratoAnalise';
import { StageContratado } from './stages/StageContratado';
import { StageCancelado } from './stages/StageCancelado';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { VendorStageSelector } from './VendorStageSelector';
import { updateVendor, promoteToNegotiation } from '@/lib/api/vendors.api';
import { NegotiationConfirmationModal } from './NegotiationConfirmationModal';
import { toast } from 'sonner';

interface VendorDetailClientProps {
    vendor: VendorDetail;
}

export function VendorDetailClient({ vendor }: VendorDetailClientProps) {
    // View Stage State for Navigation (History Mode)
    const [viewStage, setViewStage] = useState<VendorDetail['stage']>(vendor.stage);

    // Sync viewStage when vendor.stage updates (e.g. after database update)
    useEffect(() => {
        setViewStage(vendor.stage);
    }, [vendor.stage]);

    const [selectedProposal, setSelectedProposal] = useState<VendorDetail['proposals'][0] | null>(null);
    const [negotiationProposalId, setNegotiationProposalId] = useState<string | null>(null); // Track which proposal is being promoted
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [pendingStage, setPendingStage] = useState<VendorDetail['stage'] | null>(null);
    const [isUpdatingStage, setIsUpdatingStage] = useState(false);
    const [isPromoting, setIsPromoting] = useState(false); // State for promotion loading
    const router = useRouter();

    // Poll for status updates if any proposal is processing
    useEffect(() => {
        const hasProcessing = vendor.proposals?.some(p => p.status === 'PROCESSING');
        if (!hasProcessing) return;

        const interval = setInterval(() => {
            router.refresh();
        }, 5000);

        return () => clearInterval(interval);
    }, [vendor.proposals, router]);

    const handleDownload = async (proposal: VendorDetail['proposals'][0]) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/vendors/${proposal.id}/download`);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${proposal.name || 'Proposta'}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            document.body.removeChild(a);
            toast.success('Download iniciado com sucesso');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Erro ao baixar proposta');
        }
    };

    const handleAnalyze = async (proposal: VendorDetail['proposals'][0]) => {
        setIsAnalyzing(true);
        const promise = fetch(`http://127.0.0.1:3001/vendors/${proposal.id}/analyze`, {
            method: 'POST',
        }).then(async (res) => {
            if (!res.ok) throw new Error('Analysis failed');
            // Wait a bit to ensure DB update propagates before refresh (optional but helpful)
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.refresh();
            setSelectedProposal(null);
        });

        toast.promise(promise, {
            loading: 'Realizando leitura inteligente do documento...',
            success: 'Análise concluída! Os dados foram extraídos.',
            error: (err: any) => `Falha na análise: ${err.message || 'Erro de conexão'}`,
        });

        try {
            await promise;
        } catch (error) {
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRename = async (proposal: VendorDetail['proposals'][0], newName: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/vendors/${proposal.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) throw new Error('Rename failed');
            setSelectedProposal(null);
            router.refresh();
            toast.success('Proposta renomeada');
        } catch (error) {
            console.error('Rename error:', error);
            toast.error('Erro ao renomear proposta');
        }
    };

    const handleStageChange = (stage: VendorDetail['stage']) => {
        // Just change the view, don't update DB immediately unless we explicitly want to (which we don't for tabs)
        setViewStage(stage);
    };

    const confirmStageChange = async () => {
        if (!pendingStage) return;

        setIsUpdatingStage(true);
        try {
            await updateVendor(vendor.id, { stage: pendingStage });
            router.refresh();
            setPendingStage(null);
        } catch (error) {
            console.error('Error updating stage:', error);
            alert('Erro ao atualizar estágio');
        } finally {
            setIsUpdatingStage(false);
        }
    };

    const handlePromoteToNegotiation = async (proposalId: string) => {
        setNegotiationProposalId(proposalId);
    };

    const confirmNegotiation = async () => {
        if (!negotiationProposalId) return;

        setIsPromoting(true);
        try {
            await promoteToNegotiation(vendor.id, negotiationProposalId);
            router.refresh();
            // Modal will close automatically when component re-renders or we can clear state
            setNegotiationProposalId(null);
            toast.success('Fornecedor movido para Negociação!');
        } catch (error) {
            console.error('Error promoting to negotiation:', error);
            toast.error('Erro ao avançar para negociação.');
        } finally {
            setIsPromoting(false);
        }
    };

    const handleAdvanceToContract = () => {
        setPendingStage('CONTRATO_EM_ANALISE');
    };

    const renderStageContent = () => {
        const isHistoryView = viewStage !== vendor.stage;
        const currentStage = viewStage;

        switch (currentStage) {
            case 'ORCAMENTO':
                return <StageOrcamento
                    vendor={vendor}
                    onAnalyze={handleAnalyze}
                    onPromote={!isHistoryView ? handlePromoteToNegotiation : undefined}
                />;
            case 'NEGOCIACAO':
                return <StageNegociacao
                    vendor={vendor}
                    onAdvance={!isHistoryView ? handleAdvanceToContract : undefined}
                />;
            case 'CONTRATO_EM_ANALISE':
                return <StageContratoAnalise
                    vendor={vendor}
                    onAnalyze={handleAnalyze}
                    onAdvance={!isHistoryView ? () => setPendingStage('CONTRATADO') : undefined}
                />;
            case 'CONTRATADO':
                return <StageContratado vendor={vendor} />;
            case 'CANCELADO':
                return <StageCancelado vendor={vendor} />;
            default:
                return (
                    <div className="text-center py-10">
                        <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Estágio desconhecido: {vendor.stage}</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-background-warm font-sans pb-12 relative">
            <VendorNavbar
                title={vendor.name}
                subtitle={vendor.category}
                onEdit={() => setShowEditModal(true)}
            />

            <main className="max-w-4xl mx-auto w-full px-4 pt-24 space-y-6">
                <VendorStageSelector
                    currentStage={viewStage} // Use viewStage here
                    onStageChange={handleStageChange}
                    isLoading={isUpdatingStage}
                />

                {renderStageContent()}

                {/* Common sections like Notes can be appended here if needed for all stages */}
                {vendor.notes && vendor.stage !== 'CANCELADO' && (
                    <div className="mt-8 mb-8">
                        <h3 className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-3">Observações Gerais</h3>
                        <div className="bg-cream rounded-2xl p-4 text-sm text-text-secondary leading-relaxed border border-stone-100">
                            {vendor.notes}
                        </div>
                    </div>
                )}
            </main>

            {showEditModal && (
                <VendorEditModal
                    vendor={vendor}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            <NegotiationConfirmationModal
                isOpen={!!negotiationProposalId}
                onClose={() => setNegotiationProposalId(null)}
                onConfirm={confirmNegotiation}
                vendorName={vendor.name}
                proposalAd={""} // We can get name if we look it up, strict mode issue?
                isPromoting={isPromoting}
            />

            {selectedProposal && (
                <ProposalActionModal
                    isOpen={true}
                    onClose={() => setSelectedProposal(null)}
                    proposal={selectedProposal}
                    onDownload={handleDownload}
                    onAnalyze={handleAnalyze}
                    onRename={handleRename}
                    isAnalyzing={isAnalyzing}
                />
            )}

            {pendingStage && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center space-y-4 animate-scale-in">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Alterar etapa?</h3>
                        <p className="text-gray-600">
                            Tem certeza que deseja alterar a etapa deste fornecedor para <strong>{pendingStage.replace(/_/g, ' ')}</strong>?
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setPendingStage(null)}
                                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmStageChange}
                                disabled={isUpdatingStage}
                                className="flex-1 py-2.5 bg-gold-primary hover:bg-gold-hover text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {isUpdatingStage ? 'Atualizando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
