import React from 'react';
import { Bot, X, ArrowRight } from 'lucide-react';

interface NegotiationConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    vendorName: string;
    proposalAd: string;
    isPromoting: boolean;
}

export function NegotiationConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    vendorName,
    isPromoting
}: NegotiationConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border-t-4 border-gold-primary"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 pt-8 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 bg-gold-light/20 text-gold-primary rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-white shadow-sm">
                        <Bot className="w-8 h-8" />
                    </div>

                    <h2 className="text-xl font-serif font-bold text-stone-800 mb-2">
                        Iniciar Negociação com {vendorName}?
                    </h2>

                    <p className="text-stone-500 text-sm leading-relaxed mb-6 px-4">
                        A Inteligência Artificial analisará a proposta selecionada para identificar oportunidades de desconto e pontos de atenção.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isPromoting}
                            className="w-full py-3.5 bg-gold-primary hover:bg-gold-hover text-white font-bold rounded-xl shadow-lg shadow-gold-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {isPromoting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Analisando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Confirmar e Analisar</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <button
                            onClick={onClose}
                            disabled={isPromoting}
                            className="w-full py-3 text-stone-500 font-medium hover:text-stone-800 hover:underline transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
