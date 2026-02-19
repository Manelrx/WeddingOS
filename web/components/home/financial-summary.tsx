import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PremiumDashboardData } from '@/types/premium-dashboard';
import { DollarSign, Wallet } from 'lucide-react';

interface FinancialSummaryProps {
    data: PremiumDashboardData['financial'];
}

export function FinancialSummary({ data }: FinancialSummaryProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg text-text-primary px-1">Resumo Financeiro</h3>
            <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-soft border-none bg-white">
                    <CardContent className="p-5 flex flex-col gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wide text-text-secondary font-medium">Orçamento Total</span>
                            <p className="text-xl font-bold text-text-primary mt-1">{formatCurrency(data.totalBudget)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft border-none bg-white">
                    <CardContent className="p-5 flex flex-col gap-3">
                        <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-success">
                            <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wide text-text-secondary font-medium">Disponível</span>
                            <p className="text-xl font-bold text-success mt-1">{formatCurrency(data.available)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
