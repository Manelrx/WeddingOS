
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BudgetSummaryDTO } from '@/lib/api/budget.api';
import { DollarSign, Wallet, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
    data: Pick<BudgetSummaryDTO, 'totalBudget' | 'contractedTotal' | 'availableAmount'>;
}

export function BudgetSummaryCards({ data }: SummaryCardsProps) {
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
            <div className="grid grid-cols-2 gap-3">
                {/* Total Budget - Full Width or Prominent? Stitch shows clean list style or grid? 
            Stitch HTML text suggests linear list:
            "Orçamento Total R$ 50k"
            "Contratado R$ 32k"
            "Disponível R$ 18k"
            Let's preserve the FinancialSummary card style which is nice.
        */}
                <Card className="col-span-2 shadow-soft border-none bg-white">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs uppercase tracking-wide text-text-secondary font-medium">Orçamento Total</span>
                                <p className="text-2xl font-bold text-text-primary mt-0.5">{formatCurrency(data.totalBudget)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-none bg-white">
                    <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wide text-text-secondary font-medium">Contratado</span>
                        </div>
                        <p className="text-lg font-bold text-text-primary">{formatCurrency(data.contractedTotal)}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-none bg-white">
                    <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-7 w-7 rounded-full bg-success/10 flex items-center justify-center text-success">
                                <Wallet className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wide text-text-secondary font-medium">Disponível</span>
                        </div>
                        <p className="text-lg font-bold text-success">{formatCurrency(data.availableAmount)}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
