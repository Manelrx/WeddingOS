
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VendorFinancialDTO } from '@/lib/api/financial.api';

interface FinancialProgressProps {
    data: VendorFinancialDTO;
}

export function FinancialProgress({ data }: FinancialProgressProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end px-1">
                <div>
                    <p className="text-sm text-text-secondary font-medium mb-1">Valor Total do Contrato</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">{formatCurrency(data.totalPaid)}</span>
                        <span className="text-sm text-text-secondary font-medium">/ {formatCurrency(data.totalContract)}</span>
                    </div>
                </div>
            </div>

            <div className="px-1">
                <Progress value={data.progress} className="h-3" />
            </div>

            {data.notes && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-1">Nota:</p>
                    <p className="opacity-90">{data.notes}</p>
                </div>
            )}
        </div>
    );
}
