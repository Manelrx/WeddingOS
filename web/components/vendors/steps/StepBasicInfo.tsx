"use client";

import { Info, CheckCircle } from "lucide-react";

interface StepBasicInfoProps {
    data: {
        name: string;
        observation: string;
    };
    updateData: (data: Partial<{ name: string; observation: string }>) => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function StepBasicInfo({ data, updateData, onPrev, onNext }: StepBasicInfoProps) {
    return (
        <>
            <div className="flex-1 flex flex-col px-6 pt-6 overflow-y-auto no-scrollbar">
                <div className="mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-champagne-dark mb-1 block">
                        Passo 2 de 4
                    </span>
                    <h1 className="text-3xl font-bold text-warm-gray leading-tight tracking-tight">
                        Quem é o<br />fornecedor?
                    </h1>
                </div>

                <div className="mt-8 space-y-8 flex-1">
                    <div className="group">
                        <label className="block text-sm font-medium text-warm-gray-light mb-2 transition-colors group-focus-within:text-champagne-dark" htmlFor="supplierName">
                            Nome do fornecedor <span className="text-champagne-dark">*</span>
                        </label>
                        <div className="relative">
                            <input
                                autoFocus
                                className="block w-full px-4 py-4 bg-[#F9F7F2] border-0 border-b-2 border-[#E5E0D6] focus:border-champagne focus:ring-0 focus:bg-white transition-all text-lg rounded-t-lg placeholder-taupe-light text-warm-gray"
                                id="supplierName"
                                name="supplierName"
                                placeholder="Digite o nome aqui"
                                type="text"
                                value={data.name}
                                onChange={(e) => updateData({ name: e.target.value })}
                            />
                            <span className={`absolute right-4 top-4 text-champagne transition-opacity ${data.name ? 'opacity-100' : 'opacity-0'}`}>
                                <span className="material-icons">check_circle</span>
                            </span>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-warm-gray-light mb-2 transition-colors group-focus-within:text-champagne-dark" htmlFor="observation">
                            Observação opcional
                        </label>
                        <textarea
                            className="block w-full px-4 py-3 bg-[#F9F7F2] border border-[#E5E0D6] rounded-xl focus:border-champagne focus:ring-1 focus:ring-champagne focus:bg-white transition-all resize-none text-base placeholder-taupe-light text-warm-gray"
                            id="observation"
                            name="observation"
                            placeholder="Ex: indicação de um amigo..."
                            rows={4}
                            value={data.observation}
                            onChange={(e) => updateData({ observation: e.target.value })}
                        />
                    </div>

                    <div className="flex items-start space-x-3 bg-beige-soft p-4 rounded-xl border border-[#EBE6DA]">
                        <span className="material-icons text-taupe text-sm mt-0.5">info</span>
                        <p className="text-sm text-warm-gray-light leading-relaxed">
                            Não se preocupe em ter todos os detalhes agora. Você pode completar ou ajustar isso depois.
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-6 bg-ivory border-t border-[#F0EBE0] z-20 pb-10 sm:pb-6">
                <button
                    onClick={onNext}
                    disabled={!data.name}
                    className="w-full bg-gold-primary hover:bg-gold-hover text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-gold-primary/30 transform transition-all active:scale-[0.98] flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>Continuar</span>
                </button>
            </div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-champagne/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-40 left-0 -ml-20 w-48 h-48 bg-champagne/5 rounded-full blur-3xl pointer-events-none"></div>
        </>
    );
}
