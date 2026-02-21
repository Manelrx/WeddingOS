import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { VendorDetail } from '@/types/vendor.types';

interface VendorStageSelectorProps {
    currentStage: VendorDetail['stage'];
    onStageChange: (stage: VendorDetail['stage']) => void;
    isLoading?: boolean;
}

const stages = [
    { value: 'ORCAMENTO', label: 'Orçamento' },
    { value: 'NEGOCIACAO', label: 'Negociação' },
    { value: 'CONTRATO_EM_ANALISE', label: 'Contrato' },
    { value: 'CONTRATADO', label: 'Contratado' },
];

export function VendorStageSelector({ currentStage, onStageChange, isLoading }: VendorStageSelectorProps) {
    if (currentStage === 'CANCELADO') {
        return (
            <div className="w-full bg-red-50 rounded-2xl p-4 border border-red-100 mb-6 flex items-center justify-center">
                <span className="text-red-600 font-bold uppercase tracking-wider text-sm">Fornecedor Cancelado</span>
            </div>
        );
    }

    const stageOrder = ['ORCAMENTO', 'NEGOCIACAO', 'CONTRATO_EM_ANALISE', 'CONTRATADO'];
    const currentIndex = stageOrder.indexOf(currentStage);

    return (
        <div className="w-full mb-4 overflow-x-visible">
            <div className="flex items-center justify-between min-w-[320px] px-2 py-2">
                {stages.map((stage, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;
                    const isFuture = index > currentIndex;

                    return (
                        <div key={stage.value} className="flex flex-1 items-center">
                            {/* Step Item */}
                            <button
                                onClick={() => !isActive && !isLoading && onStageChange(stage.value as any)}
                                disabled={isLoading || isActive}
                                className={`
                                    flex flex-col items-center gap-2 group min-w-[80px]
                                    ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                `}
                            >
                                {/* Circle Indicator */}
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2
                                    ${isActive
                                        ? 'bg-gold-primary border-gold-primary text-white scale-110 shadow-lg shadow-gold-primary/30'
                                        : isCompleted
                                            ? 'bg-white border-gold-primary text-gold-primary'
                                            : 'bg-white border-gray-200 text-gray-300'
                                    }
                                `}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
                                </div>

                                {/* Label */}
                                <span className={`
                                    text-[10px] uppercase tracking-wider font-bold transition-colors
                                    ${isActive ? 'text-gold-darker' : isCompleted ? 'text-gold-dark' : 'text-gray-300'}
                                `}>
                                    {stage.label}
                                </span>
                            </button>

                            {/* Connector Line (except last) */}
                            {index < stages.length - 1 && (
                                <div className="h-[2px] w-full flex-1 mx-2 relative bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`absolute inset-0 transition-all duration-500 ${isCompleted ? 'bg-gold-primary' : 'bg-transparent'
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
