import React from 'react';
import { VendorDetail } from '@/types/vendor.types';
import { AlertTriangle, Archive } from 'lucide-react';

interface StageCanceladoProps {
    vendor: VendorDetail;
}

export function StageCancelado({ vendor }: StageCanceladoProps) {
    const totalValue = vendor.finalContractValue || vendor.totalValue || 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 relative overflow-hidden grayscale opacity-75">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gray-100 p-3 rounded-full">
                        <Archive className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700">Fornecedor Arquivado / Cancelado</h2>
                        <p className="text-sm text-gray-500">Este fornecedor não está mais ativo no seu planejamento.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-medium">Último Valor</span>
                        <div className="text-lg font-semibold text-gray-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                        </div>
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-400 font-medium">Motivo (Notas)</span>
                        <div className="text-sm text-gray-600 mt-1 italic">
                            {vendor.notes || "Nenhuma observação registrada."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
