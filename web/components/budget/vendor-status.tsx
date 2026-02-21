
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BudgetSummaryDTO } from '@/lib/api/budget.api';

interface VendorStatusProps {
    data: BudgetSummaryDTO['vendorStatus'];
}

export function VendorStatus({ data }: VendorStatusProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg text-text-primary px-1">Status dos Fornecedores</h3>
            <div className="grid grid-cols-3 gap-3">
                <StatusCard label="Contratados" count={data.contracted} color="text-success" />
                <StatusCard label="Em negociação" count={data.negotiating} color="text-primary" />
                <StatusCard label="Não definidos" count={data.undefined} color="text-muted-foreground" />
            </div>
        </div>
    );
}

function StatusCard({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <Card className="shadow-sm border-none bg-white">
            <CardContent className="p-3 flex flex-col items-center text-center justify-center h-full">
                <span className={`text-2xl font-bold ${color}`}>{count}</span>
                <span className="text-[10px] leading-tight text-muted-foreground font-medium mt-1">{label}</span>
            </CardContent>
        </Card>
    )
}
