
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InstallmentDTO } from '@/lib/api/financial.api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface InstallmentListProps {
    installments: InstallmentDTO[];
    vendorId: string;
}

export function InstallmentList({ installments, vendorId }: InstallmentListProps) {
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Assuming installs are ordered by date? Backend does order by date.
    // Need to calculate "Parcela X de Y" if not provided.
    // Stitch shows "Parcela 1 de 5".
    // We'll map index + 1.

    const getStatusInfo = (inst: InstallmentDTO) => {
        if (inst.status === 'PAGO') return { label: 'Pago', color: 'text-success', icon: CheckCircle2, bg: 'bg-success/10' };

        // Calculate days if EM_ABERTO
        const days = Math.ceil((new Date(inst.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        if (inst.status === 'ATRASADO' || days < 0) return { label: 'Atrasado', color: 'text-red-600', icon: AlertCircle, bg: 'bg-red-50' };
        if (days === 0) return { label: 'Vence hoje', color: 'text-amber-600', icon: AlertCircle, bg: 'bg-amber-50' };

        return { label: `Vence em ${days} dias`, color: 'text-blue-600', icon: Circle, bg: 'bg-blue-50' };
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg text-text-primary px-1">Parcelas</h3>
            <div className="space-y-3">
                {installments.map((inst, index) => {
                    const status = getStatusInfo(inst);
                    const StatusIcon = status.icon;

                    return (
                        <Link key={inst.id} href={`/fornecedores/${vendorId}/registrar-pagamento?installmentId=${inst.id}`}>
                            <Card className="shadow-sm border-none bg-white active:scale-[0.99] transition-transform">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-text-secondary font-semibold mb-1">
                                            Parcela {index + 1} de {installments.length}
                                        </p>
                                        <p className="text-lg font-bold text-text-primary">{formatCurrency(inst.amount)}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5", status.bg, status.color)}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {status.label}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
