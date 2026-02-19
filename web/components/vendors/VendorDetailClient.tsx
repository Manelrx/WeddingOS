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
import { AlertCircle } from 'lucide-react';

interface VendorDetailClientProps {
    vendor: VendorDetail;
}

export function VendorDetailClient({ vendor }: VendorDetailClientProps) {
    const [selectedProposal, setSelectedProposal] = useState<VendorDetail['proposals'][0] | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
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
            alert('Download iniciado');
        } catch (error) {
            console.error('Download error:', error);
            alert('Erro ao baixar proposta');
        }
    };

    const handleAnalyze = async (proposal: VendorDetail['proposals'][0]) => {
        try {
            setIsAnalyzing(true);
            const response = await fetch(`http://127.0.0.1:3001/vendors/${proposal.id}/analyze`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Analysis failed');

            alert('Análise iniciada! Acompanhe o status na proposta.');
            setSelectedProposal(null);
            router.refresh();
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Erro ao iniciar análise');
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
        } catch (error) {
            console.error('Rename error:', error);
            alert('Erro ao renomear proposta');
        }
    };

    const renderStageContent = () => {
        switch (vendor.stage) {
            case 'ORCAMENTO':
                return <StageOrcamento vendor={vendor} onAnalyze={handleAnalyze} />;
            case 'NEGOCIACAO':
                return <StageNegociacao vendor={vendor} />;
            case 'CONTRATO_EM_ANALISE':
                return <StageContratoAnalise vendor={vendor} />;
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

            <main className="max-w-4xl mx-auto w-full px-4 pt-6">
                {/* Stage Indicator (Optional - could be in Navbar) */}

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
        </div>
    );
}
