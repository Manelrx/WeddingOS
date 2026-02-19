"use client";

import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Risk {
    type?: string;
    tipo?: string;
    description?: string;
    descricao?: string;
    severidade?: string;
}

interface ProposalRiskSectionProps {
    risks?: Risk[];
}

export function ProposalRiskSection({ risks = [] }: ProposalRiskSectionProps) {
    if (!risks || risks.length === 0) return null;

    const getSeverityColor = (severity?: string) => {
        switch ((severity ?? '').toLowerCase()) {
            case 'alta': return 'bg-red-100 text-red-800 border-red-200';
            case 'média': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'baixa': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeLabel = (type?: string) => {
        switch ((type ?? '').toLowerCase()) {
            case 'financeiro': return 'Risco Financeiro';
            case 'contratual': return 'Risco Contratual';
            case 'operacional': return 'Risco Operacional';
            default: return type || 'Risco';
        }
    };

    return (
        <section className="mb-8">
            <h3 className="text-lg font-serif font-medium text-text-primary mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-accent-gold" />
                Matriz de Riscos Identificados
            </h3>

            <div className="space-y-3">
                {risks.map((risk, idx) => (
                    <div key={idx} className="bg-background-card border border-divider rounded-xl p-4 shadow-sm flex items-start gap-4">
                        <div className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border shrink-0 mt-0.5",
                            getSeverityColor(risk.severidade)
                        )}>
                            {risk.severidade || '—'}
                        </div>

                        <div className="flex-1">
                            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                {getTypeLabel(risk.tipo || risk.type)}
                            </span>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {risk.descricao || risk.description || '—'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
