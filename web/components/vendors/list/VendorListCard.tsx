import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, Flower2, CheckCircle, Archive } from 'lucide-react';
import { cva } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';
import { VendorSummary } from '@/types/vendor.types';

const statusStyles = cva(
    "rounded-xl p-3 flex items-center justify-between border transition-colors",
    {
        variants: {
            status: {
                analyzing: "bg-bg-analyzing border-status-analyzing/20 text-status-analyzing",
                negotiating: "bg-bg-negotiating border-status-negotiating/20 text-status-negotiating",
                closed: "bg-bg-closed border-status-closed/20 text-status-closed",
                discarded: "bg-bg-discarded border-stone-200 text-text-muted",
            },
        },
        defaultVariants: {
            status: "analyzing",
        },
    }
);

interface VendorListCardProps {
    vendor: VendorSummary;
}

const statusLabels = {
    analyzing: "Analisando",
    negotiating: "Em negociação",
    closed: "Fechado",
    discarded: "Descartado"
};

const actionLabels = {
    analyzing: "Agendar visita",
    negotiating: "Revisar pontos",
    closed: "Contrato assinado",
    discarded: "Arquivado"
};

export function VendorListCard({ vendor }: VendorListCardProps) {
    const { name, category, totalValue, status } = vendor;

    // Fallback image based on category if needed, or just a generic placeholder
    // Since the API doesn't provide an image yet, we might need a deterministic placeholder or keep using random ones for now
    // For this step, I'll use a placeholder or check if I can get an image. 
    // The previous code had manual images. I will use a placeholder for now as per instructions "No mock data" - but we need to display SOMETHING.
    // I'll use a consistent placeholder service or local asset if available.
    // Retaining random unsplash for visual fidelity as "real data" doesn't have images yet. 
    // Wait, the prompt says "No mock data". But we don't have images in backend.
    // I'll use a standard placeholder based on category or name hash to be deterministic.
    const imageSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(totalValue);

    return (
        <Link href={`/fornecedores/${vendor.id}`} className="block bg-surface-card rounded-3xl p-5 shadow-card hover:shadow-card-hover border border-stone-100/80 relative group transition-all duration-300 transform translate-y-0 hover:-translate-y-1 cursor-pointer">
            {/* Upper Content */}
            <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                    "w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md ring-1 ring-stone-100 relative",
                    status === 'discarded' && "grayscale opacity-80"
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
                                status === 'discarded' ? "text-text-muted line-through decoration-stone-300" : ""
                            )}>
                                {name}
                            </h3>
                            <p className="text-xs text-text-muted mt-1 font-medium">{category}</p>
                        </div>
                        <span className={cn(
                            "text-sm font-semibold whitespace-nowrap",
                            status === 'closed' ? "text-text-main" :
                                status === 'discarded' ? "text-text-muted line-through decoration-stone-300" :
                                    status === 'analyzing' ? "text-primary" : "text-text-main"
                        )}>
                            {formattedPrice}
                        </span>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className={statusStyles({ status })}>
                <div className="flex items-center gap-2.5">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'analyzing' && "bg-status-analyzing",
                        status === 'negotiating' && "bg-status-negotiating animate-pulse",
                        status === 'closed' && "bg-status-closed",
                        status === 'discarded' && "bg-status-discarded"
                    )} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                        {statusLabels[status]}
                    </span>
                </div>

                <div className={cn(
                    "flex items-center gap-1.5",
                    status === 'analyzing' && "text-status-analyzing/80",
                    status === 'negotiating' && "text-status-negotiating",
                    status === 'closed' && "text-status-closed",
                    status === 'discarded' && "text-text-muted/70"
                )}>
                    {status === 'analyzing' && <Eye className="w-4 h-4" />}
                    {status === 'negotiating' && <Flower2 className="w-4 h-4" />}
                    {status === 'closed' && <CheckCircle className="w-4 h-4" />}
                    {status === 'discarded' && <Archive className="w-4 h-4" />}

                    <span className="text-xs font-medium">
                        {actionLabels[status]}
                    </span>
                </div>
            </div>
        </Link>
    );
}

