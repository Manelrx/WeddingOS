import React from 'react';
import { SectionCard } from './SectionCard';
import { DollarSign, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialMetricProps {
    label: string;
    value: string;
    subtext?: string;
    icon: React.ElementType;
    trend?: 'neutral' | 'good' | 'warning';
}

function FinancialMetric({ label, value, subtext, icon: Icon, trend = 'neutral' }: FinancialMetricProps) {
    return (
        <div className="flex flex-col gap-3 p-4 rounded-xl hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
            </div>
            <div>
                <div className="text-2xl font-serif text-text-primary">{value}</div>
                {subtext && (
                    <div className={cn("text-xs mt-1 font-medium", {
                        "text-slate-400": trend === 'neutral',
                        "text-emerald-600": trend === 'good',
                        "text-amber-600": trend === 'warning'
                    })}>
                        {subtext}
                    </div>
                )}
            </div>
        </div>
    );
}

export function VendorFinancialSummary() {
    return (
        <SectionCard className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <FinancialMetric
                    label="Valor Total"
                    value="R$ 45.000,00"
                    subtext="Contrato assinado"
                    icon={DollarSign}
                />
                <FinancialMetric
                    label="Pago até hoje"
                    value="R$ 15.000,00"
                    subtext="33% do total"
                    icon={CreditCard}
                    trend="good"
                />
                <FinancialMetric
                    label="Saldo Restante"
                    value="R$ 30.000,00"
                    subtext="Vence em 15 dias"
                    icon={Wallet}
                    trend="warning"
                />
                <FinancialMetric
                    label="Condições"
                    value="3x Parcelado"
                    subtext="Próx: 10/05/2026"
                    icon={AlertCircle}
                />
            </div>
        </SectionCard>
    );
}
