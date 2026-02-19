import React from 'react';
import { VendorDetail } from '@/types/vendor.types';
import { ShieldAlert, FileCheck, Search, UploadCloud } from 'lucide-react';

interface StageContratoAnaliseProps {
    vendor: VendorDetail;
}

export function StageContratoAnalise({ vendor }: StageContratoAnaliseProps) {
    // This stage would ideally use a specific ContractAnalysis model. 
    // Since we are reusing proposal analysis for now or waiting for a specific contract file,
    // we will simulate the behavior based on prompt requirements "Trigger AI contract analysis".

    // For MVP/Prompt scope, we might show a placeholder or the "Upload Contract" UI.

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-fuchsia-500" />

                <div className="text-center max-w-lg mx-auto py-8">
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-display font-semibold text-gray-900">Análise de Contrato</h2>
                    <p className="text-gray-500 mt-2 mb-8">
                        Faça o upload da minuta do contrato para que nossa IA identifique cláusulas abusivas, multas e riscos jurídicos.
                    </p>

                    <button className="w-full py-4 border-2 border-dashed border-purple-200 rounded-2xl flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-all group cursor-pointer bg-white">
                        <UploadCloud className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform mb-2" />
                        <span className="font-medium text-purple-900">Clique para enviar o PDF do Contrato</span>
                        <span className="text-xs text-purple-400 mt-1">PDF até 10MB</span>
                    </button>
                </div>
            </div>

            {/* Mocked/Future Analysis Result Container - Hidden until upload */}
            {/* 
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    Riscos Contratuais Detectados
                </h3>
                ...
            </div> 
            */}
        </div>
    );
}
