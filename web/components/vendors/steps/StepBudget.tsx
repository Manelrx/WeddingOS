"use client";

import { Info, Paperclip, ArrowRight } from "lucide-react";

interface StepBudgetProps {
    data: {
        value: string;
        proposalFile: File | null;
    };
    updateData: (data: Partial<{ value: string; proposalFile: File | null }>) => void;
    onPrev: () => void;
    onNext: () => void;
    isSubmitting?: boolean;
    error?: string | null;
}

export default function StepBudget({ data, updateData, onPrev, onNext, isSubmitting = false, error = null }: StepBudgetProps) {
    return (
        <>
            <div className="flex-1 px-6 overflow-y-auto no-scrollbar">
                <div className="mt-4 mb-10">
                    <h1 className="text-3xl font-semibold leading-tight mb-3 text-text-primary">
                        O que você já sabe até agora?
                    </h1>
                    <p className="text-text-secondary text-lg font-light leading-relaxed">
                        Preencha os detalhes financeiros. Se não souber o valor exato, uma estimativa já ajuda.
                    </p>
                </div>

                <section className="mb-10 animate-fade-in-up">
                    <label className="block text-sm font-medium text-warm-gray uppercase tracking-wider mb-3" htmlFor="value">
                        Valor Estimado
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gold-dark/60 text-3xl font-light">R$</span>
                        </div>
                        <input
                            className="block w-full pl-16 pr-4 py-6 bg-cream border-2 border-transparent focus:border-gold rounded-2xl text-4xl font-semibold text-text-primary placeholder-warm-gray/50 focus:outline-none focus:ring-0 transition-all shadow-input group-hover:bg-[#F0EDE4]"
                            id="value"
                            name="value"
                            placeholder="0,00"
                            type="text"
                            value={data.value}
                            onChange={(e) => updateData({ value: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>
                    <p className="mt-3 text-sm text-text-secondary flex items-center gap-2">
                        <span className="material-icons-round text-base text-gold">info</span>
                        É apenas uma estimativa, não se preocupe.
                    </p>
                </section>

                <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-warm-gray uppercase tracking-wider">
                            Proposta
                        </label>
                        <span className="text-xs text-gold-dark bg-gold/10 px-2 py-1 rounded-md font-medium">Opcional</span>
                    </div>
                    <div className="relative w-full mb-6">
                        <label
                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-cream hover:bg-[#F0EDE4] hover:border-gold/50 transition-all duration-300 group shadow-sm ${data.proposalFile ? 'border-gold bg-gold/5' : 'border-warm-gray/30'} ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                            htmlFor="file-upload"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-3 mb-3 rounded-full bg-ivory shadow-sm group-hover:bg-white transition-colors">
                                    <span className="material-icons-round text-2xl text-gold-dark group-hover:text-gold transition-colors">
                                        {data.proposalFile ? 'check_circle' : 'attach_file'}
                                    </span>
                                </div>
                                <p className="mb-1 text-sm font-medium text-text-primary group-hover:text-text-primary/80">
                                    {data.proposalFile ? data.proposalFile.name : 'Anexar proposta (PDF)'}
                                </p>
                                <p className="text-xs text-warm-gray">
                                    {data.proposalFile ? 'Toque para trocar' : 'Toque para selecionar'}
                                </p>
                            </div>
                            <input
                                accept=".pdf"
                                className="hidden"
                                id="file-upload"
                                type="file"
                                disabled={isSubmitting}
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    updateData({ proposalFile: file });
                                }}
                            />
                        </label>
                    </div>
                </section>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        {error}
                    </div>
                )}
            </div>
            <footer className="safe-area-bottom px-6 pb-8 pt-4 bg-gradient-to-t from-ivory via-ivory to-transparent flex-none z-10 w-full">
                <div className="flex flex-col gap-4">
                    <button
                        onClick={onNext}
                        disabled={isSubmitting}
                        className={`w-full bg-gold-primary hover:bg-gold-hover text-white font-medium text-lg py-4 rounded-xl shadow-soft shadow-gold-primary/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Salvando...
                            </>
                        ) : (
                            'Concluir'
                        )}
                    </button>
                    <button
                        onClick={onNext}
                        disabled={isSubmitting}
                        className={`w-full py-3 text-warm-gray hover:text-text-primary font-medium text-sm transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Pular por enquanto
                    </button>
                </div>
            </footer>
        </>
    );
}
