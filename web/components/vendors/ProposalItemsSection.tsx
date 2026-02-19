"use client";

import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Item {
    textoOriginal: string;
    chaveNormalizada: string;
    categoria: string;
    incluido: boolean | null;
    observacoes?: string | null;
}

interface ProposalItemsSectionProps {
    items?: Item[];
}

export function ProposalItemsSection({ items = [] }: ProposalItemsSectionProps) {
    if (!items || items.length === 0) return null;

    // Group by category
    const grouped = items.reduce((acc, item) => {
        const cat = item.categoria || 'outros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, Item[]>);

    return (
        <section className="mb-8">
            <h3 className="text-lg font-serif font-medium text-text-primary mb-4">Itens da Proposta</h3>

            <div className="space-y-6">
                {Object.entries(grouped).map(([category, categoryItems]) => (
                    <div key={category} className="bg-white/50 rounded-xl border border-divider overflow-hidden">
                        <div className="bg-background-warm/80 px-4 py-2 border-b border-divider">
                            <h4 className="font-medium text-xs uppercase tracking-wider text-text-secondary">{category}</h4>
                        </div>
                        <div className="divide-y divide-divider/50">
                            {categoryItems.map((item, idx) => (
                                <div key={idx} className="p-4 flex items-start gap-3 hover:bg-white/40 transition-colors">
                                    <div className={cn(
                                        "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                                        item.incluido === true && "bg-green-100 border-green-200 text-green-700",
                                        item.incluido === false && "bg-red-100 border-red-200 text-red-700",
                                        item.incluido === null && "bg-gray-100 border-gray-200 text-gray-500"
                                    )}>
                                        {item.incluido === true && <Check className="w-3 h-3" />}
                                        {item.incluido === false && <X className="w-3 h-3" />}
                                        {item.incluido === null && <Minus className="w-3 h-3" />}
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-primary">{item.textoOriginal}</p>
                                        {item.observacoes && (
                                            <p className="text-xs text-text-muted mt-1">{item.observacoes}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
