"use client";

import React, { useState } from 'react';
import { Download, Sparkles, X, FileText, Pencil, Check } from 'lucide-react';
import { Proposal } from '@/types/vendor.types';

interface ProposalActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposal: Proposal;
    onDownload: (proposal: Proposal) => void;
    onAnalyze: (proposal: Proposal) => void;
    onRename: (proposal: Proposal, newName: string) => void;
    isAnalyzing: boolean;
}

export function ProposalActionModal({
    isOpen,
    onClose,
    proposal,
    onDownload,
    onAnalyze,
    onRename,
    isAnalyzing
}: ProposalActionModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(proposal.name || '');

    if (!isOpen) return null;

    const handleSaveRename = () => {
        if (newName.trim() && newName !== proposal.name) {
            onRename(proposal, newName.trim());
        }
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-serif text-lg text-stone-800">Ações da Proposta</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Proposal Info with editable name */}
                    <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="p-3 bg-white rounded-lg shadow-sm text-stone-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        autoFocus
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                                        className="text-sm font-medium text-stone-800 bg-white border border-stone-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30"
                                    />
                                    <button
                                        onClick={handleSaveRename}
                                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors shrink-0"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-stone-800 text-sm line-clamp-1">{proposal.name}</p>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-1 rounded-md hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors shrink-0"
                                        title="Renomear proposta"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-stone-500 mt-0.5">
                                {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => onDownload(proposal)}
                            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all group"
                        >
                            <div className="p-3 rounded-full bg-stone-100 text-stone-600 group-hover:bg-white group-hover:text-gold-primary transition-colors">
                                <Download className="w-6 h-6" />
                            </div>
                            <span className="font-medium text-stone-700 text-sm">Baixar PDF</span>
                        </button>

                        <button
                            onClick={() => onAnalyze(proposal)}
                            disabled={isAnalyzing || proposal.status === 'PROCESSING'}
                            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-blue-400/50 hover:bg-blue-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="p-3 rounded-full bg-blue-50 text-blue-500 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                {isAnalyzing || proposal.status === 'PROCESSING' ? (
                                    <Sparkles className="w-6 h-6 animate-pulse" />
                                ) : (
                                    <Sparkles className="w-6 h-6" />
                                )}
                            </div>
                            <span className="font-medium text-stone-700 text-sm">
                                {proposal.status === 'SUCCESS' ? 'Reanalisar' :
                                    isAnalyzing || proposal.status === 'PROCESSING' ? 'Analisando...' :
                                        'Analisar com IA'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
