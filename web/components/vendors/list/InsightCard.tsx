import React from 'react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
    negotiatingCount: number;
}

export function InsightCard({ negotiatingCount }: InsightCardProps) {
    if (negotiatingCount === 0) return null;

    return (
        <div className="mb-8 bg-surface-card rounded-2xl p-5 border border-accent-gold/20 shadow-[0_8px_30px_-8px_rgba(197,169,111,0.15)] relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-gold/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
                <h3 className="text-lg font-serif font-medium text-text-main mb-2">
                    Olá! Você está indo muito bem no planejamento.
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                    Temos <span className="font-medium text-accent-gold">{negotiatingCount} {negotiatingCount === 1 ? 'fornecedor' : 'fornecedores'}</span> em negociação que precisam da sua atenção hoje.
                </p>
            </div>
        </div>
    );
}
