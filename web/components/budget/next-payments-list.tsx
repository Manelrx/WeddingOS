
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BudgetSummaryDTO } from '@/lib/api/budget.api';
import { CalendarDays, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
// import { format, differenceInDays } from 'date-fns'; // Assuming date-fns is available or use native

interface NextPaymentsProps {
    payments: BudgetSummaryDTO['nextPayments'];
}

export function NextPaymentsList({ payments }: NextPaymentsProps) {
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
    };

    const getDaysRemaining = (dateStr: string) => {
        const today = new Date();
        const due = new Date(dateStr);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Venceu';
        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Amanhã';
        return `Vence em ${diffDays} dias`;
    };

    const getStatusColor = (dateStr: string) => {
        const days = getDaysRemaining(dateStr);
        if (typeof days === 'string' && (days === 'Venceu' || days.includes('-'))) return 'text-red-500 bg-red-50 border-red-100';
        if (days === 'Hoje' || days === 'Amanhã') return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-blue-600 bg-blue-50 border-blue-100';
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg text-text-primary px-1">Próximos Pagamentos</h3>
            <div className="space-y-3">
                {payments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic pl-1">Nenhum pagamento próximo.</p>
                ) : (
                    payments.map((payment) => (
                        <Link key={payment.id} href={`/fornecedores/${payment.vendorId}/financeiro`}>
                            <Card className="shadow-sm border-none bg-white overflow-hidden hover:bg-gray-50 transition-colors">
                                <CardContent className="p-0 flex flex-row">
                                    <div className={cn("w-1.5", getStatusColor(payment.dueDate).replace('text-', 'bg-').split(' ')[0])} />
                                    <div className="flex-1 p-4 flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-medium text-sm text-gray-900">{payment.vendorName}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", getStatusColor(payment.dueDate))}>
                                                    {getDaysRemaining(payment.dueDate)}
                                                </span>
                                                <span className="text-xs text-text-secondary flex items-center gap-1">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {formatDate(payment.dueDate)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                                            {/* Assuming backend doesn't send "Parc 2/5" yet, just amount. 
                                 Ideally update DTO if this is required, but schema doesn't link installments to total installments cleanly 
                                 without traversing all installments. Keeping simple for now. 
                             */}
                                            <span className="text-xs text-text-secondary">Parcela</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
