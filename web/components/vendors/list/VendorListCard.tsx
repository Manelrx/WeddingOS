import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, Flower2, CheckCircle, Archive, FileText, Scale } from 'lucide-react';
import { cva } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';
import { VendorSummary, VendorStage } from '@/types/vendor.types';

const stageStyles = cva(
    "rounded-xl p-3 flex items-center justify-between border transition-colors",
    {
        variants: {
            stage: {
                ORCAMENTO: "bg-blue-50 border-blue-100 text-blue-700",
                NEGOCIACAO: "bg-amber-50 border-amber-100 text-amber-700",
                CONTRATO_EM_ANALISE: "bg-purple-50 border-purple-100 text-purple-700",
                CONTRATADO: "bg-emerald-50 border-emerald-100 text-emerald-700",
                CANCELADO: "bg-gray-50 border-gray-200 text-gray-400",
            },
        },
        defaultVariants: {
            stage: "ORCAMENTO",
        },
    }
);

interface VendorListCardProps {
    vendor: VendorSummary;
}

const stageLabels: Record<VendorStage, string> = {
    ORCAMENTO: "Em Análise",
    NEGOCIACAO: "Em Negociação",
    CONTRATO_EM_ANALISE: "Contrato em Análise",
    CONTRATADO: "Contratado",
    CANCELADO: "Cancelado"
};

const actionLabels: Record<VendorStage, string> = {
    ORCAMENTO: "Comparar propostas",
    NEGOCIACAO: "Ver estratégia",
    CONTRATO_EM_ANALISE: "Revisar minuta",
    CONTRATADO: "Ver contrato",
    CANCELADO: "Ver detalhes"
};

export function VendorListCard({ vendor }: VendorListCardProps) {
    const { name, category, totalValue, stage } = vendor;

    const imageSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const displayValue = totalValue > 0 ? totalValue : (vendor.estimatedValue || 0);

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(displayValue);

    return (
        <Link href={`/fornecedores/${vendor.id}`} className="block bg-surface-card rounded-3xl p-5 shadow-card hover:shadow-card-hover border border-stone-100/80 relative group transition-all duration-300 transform translate-y-0 hover:-translate-y-1 cursor-pointer">
            {/* Upper Content */}
            <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                    "w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md ring-1 ring-stone-100 relative",
                    stage === 'CANCELADO' && "grayscale opacity-80"
                )}>
                    <Image
                        alt={name}
                        src={imageSrc}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex justify-between items-start">
                        <div className="pr-2">
                            <h3 className={cn(
                                "text-lg font-serif text-text-main leading-tight truncate",
                                stage === 'CANCELADO' ? "text-text-muted line-through decoration-stone-300" : ""
                            )}>
                                {name}
                            </h3>
                            <p className="text-xs text-text-muted mt-1 font-medium bg-gray-50 inline-block px-2 py-0.5 rounded-full border border-gray-100">
                                {stageLabels[stage]}
                            </p>
                        </div>
                        <span className={cn(
                            "text-sm font-semibold whitespace-nowrap",
                            stage === 'CONTRATADO' ? "text-emerald-600" :
                                stage === 'CANCELADO' ? "text-text-muted line-through decoration-stone-300" :
                                    "text-text-main"
                        )}>
                            {formattedPrice}
                        </span>
                    </div>
                    <p className="text-xs text-text-muted/60 mt-1 capitalize">{category === 'decoration' ? 'Decoração' : category}</p>
                </div>
            </div>

            {/* Status Bar */}
            <div className={stageStyles({ stage })}>
                <div className="flex items-center gap-2.5">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        stage === 'ORCAMENTO' && "bg-blue-500",
                        stage === 'NEGOCIACAO' && "bg-amber-500 animate-pulse",
                        stage === 'CONTRATO_EM_ANALISE' && "bg-purple-500",
                        stage === 'CONTRATADO' && "bg-emerald-500",
                        stage === 'CANCELADO' && "bg-gray-400"
                    )} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                        {stageLabels[stage]}
                    </span>
                </div>

                <div className={cn(
                    "flex items-center gap-1.5",
                    "opacity-90"
                )}>
                    {stage === 'ORCAMENTO' && <Eye className="w-4 h-4" />}
                    {stage === 'NEGOCIACAO' && <Flower2 className="w-4 h-4" />}
                    {stage === 'CONTRATO_EM_ANALISE' && <Scale className="w-4 h-4" />}
                    {stage === 'CONTRATADO' && <CheckCircle className="w-4 h-4" />}
                    {stage === 'CANCELADO' && <Archive className="w-4 h-4" />}

                    <span className="text-xs font-medium hidden sm:inline-block">
                        {actionLabels[stage]}
                    </span>
                </div>
            </div>
        </Link>
    );
}

