import React from 'react';
import { VendorDetail } from '@/types/vendor.types';
import { CheckCircle2, DollarSign, Calendar, Clock } from 'lucide-react';
import { VendorDetailsList } from '../VendorDetailsList';

interface StageContratadoProps {
    vendor: VendorDetail;
}

export function StageContratado({ vendor }: StageContratadoProps) {
    const totalPaid = vendor.amountPaid || 0;
    const totalValue = vendor.finalContractValue || vendor.totalValue || 0;
    const remaining = totalValue - totalPaid;
    const progress = totalValue > 0 ? (totalPaid / totalValue) * 100 : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl shadow-gray-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Fornecedor Contratado
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div>
                        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Valor do Contrato</span>
                        <div className="text-3xl font-display font-semibold mt-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Valor Pago</span>
                        <div className="text-3xl font-display font-semibold mt-1 text-emerald-400">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaid)}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">A Pagar</span>
                        <div className="text-3xl font-display font-semibold mt-1 text-amber-400">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(remaining)}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 relative pt-2">
                    <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                        <span>Progresso de Pagamentos</span>
                        <span>{Math.round(progress)}% Quitado</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Payment Tracking / Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        Próximos Pagamentos
                    </h3>

                    {vendor.paymentConditions ? (
                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">
                            {vendor.paymentConditions}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Condições de pagamento não informadas.</p>
                    )}

                    <button className="mt-4 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200">
                        Registrar Pagamento
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        Documentos
                    </h3>
                    {/* Placeholder for documents list */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg text-gray-400 group-hover:text-gray-600 shadow-sm">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Contrato Assinado.pdf</span>
                            </div>
                        </div>
                        <button className="w-full py-2 border border-dashed border-gray-300 text-gray-400 rounded-xl text-sm hover:border-gray-400 hover:text-gray-500 transition-colors">
                            + Adicionar documento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper icon
function FileText({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    );
}
