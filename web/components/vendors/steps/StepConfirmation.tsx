"use client";

import { Check, Bookmark, Plus, ArrowRight } from "lucide-react";

interface StepConfirmationProps {
    data: {
        name: string;
        type: string;
    };
    onClose: () => void;
    onAddAnother: () => void;
}

const typeLabels: Record<string, string> = {
    buffet: "Buffet",
    photography: "Fotografia",
    music: "Música / DJ",
    local: "Local",
    decoration: "Decoração",
    other: "Outro"
};

export default function StepConfirmation({ data, onClose, onAddAnother }: StepConfirmationProps) {
    return (
        <div className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center h-full overflow-y-auto no-scrollbar">
            <div className="w-full mb-8 pt-2 flex-none">
                <div className="flex justify-between mb-2">
                    <span className="text-xs font-medium text-gold-600 tracking-wide uppercase">Finalizado</span>
                    <span className="text-xs font-medium text-taupe-500">4 de 4</span>
                </div>
                <div className="h-1.5 w-full bg-ivory-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400 rounded-full w-full"></div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full -mt-10">
                <div className="mb-10 relative animate-[scaleIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] delay-[100ms]" style={{ animationDelay: '0.1s' }}>
                    <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-xl transform scale-150 animate-pulse"></div>
                    <div className="relative w-28 h-28 bg-white border border-gold-300/30 rounded-full flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(212,175,55,0.2)] ring-1 ring-white/60">
                        <div className="w-24 h-24 rounded-full bg-gold-50/50 flex items-center justify-center">
                            <span className="material-icons-outlined text-5xl text-gold-400 drop-shadow-[0_2px_4px_rgba(212,175,55,0.2)]">check</span>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-4 mb-12 max-w-xs mx-auto animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] delay-[300ms]" style={{ animationDelay: '0.3s' }}>
                    <h1 className="text-3xl font-semibold tracking-tight text-ivory-900 drop-shadow-sm">
                        Fornecedor adicionado
                    </h1>
                    <p className="text-taupe-700 font-light leading-relaxed text-lg">
                        Excelente escolha. Mais um passo concluído para o seu dia perfeito.
                    </p>
                </div>

                <div className="w-full mb-10 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] delay-[500ms]" style={{ animationDelay: '0.5s' }}>
                    <div className="bg-surface-light/80 backdrop-blur-md border border-ivory-300/40 rounded-2xl p-4 flex items-center space-x-4 shadow-[0_8px_30px_rgba(212,175,55,0.06)]">
                        <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-taupe-200 relative shadow-inner">
                            <img
                                alt="Vendor preview"
                                className="h-full w-full object-cover opacity-90"
                                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-ivory-900 font-medium truncate">{data.name}</h3>
                            <p className="text-gold-600 text-sm">{typeLabels[data.type] || data.type || "Fornecedor"}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gold-50 flex items-center justify-center border border-gold-100">
                            <span className="material-icons-outlined text-gold-400 text-sm">bookmark</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-4 mt-auto pb-4 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] delay-[700ms] flex-none" style={{ animationDelay: '0.7s' }}>
                <button
                    onClick={onClose}
                    className="w-full h-14 bg-gold-primary hover:bg-gold-hover text-white font-medium rounded-xl shadow-lg shadow-gold-primary/30 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center space-x-2 group"
                >
                    <span>Ver fornecedor</span>
                </button>
                <button
                    onClick={onAddAnother}
                    className="w-full h-14 bg-transparent border border-taupe-300 hover:border-taupe-500 hover:bg-taupe-200/20 text-taupe-700 font-medium rounded-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center"
                >
                    <span>Adicionar outro fornecedor</span>
                </button>
            </div>

            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] rounded-full bg-gold-300/10 blur-[120px]"></div>
                <div className="absolute -bottom-[20%] -left-[20%] w-[500px] h-[500px] rounded-full bg-taupe-300/10 blur-[100px]"></div>
            </div>
        </div>
    );
}
