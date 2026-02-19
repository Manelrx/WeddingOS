import React from 'react';
import { PremiumDashboardData } from '@/types/premium-dashboard';
import { AlertCircle } from 'lucide-react';

interface AlertCardProps {
    payment: PremiumDashboardData['planning']['pendingPayment'];
}

export function AlertCard({ payment }: AlertCardProps) {
    if (!payment) return null;
    return (
        <div className="bg-red-50 rounded-lg p-4 flex items-start gap-3 border border-red-100/50">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-red-900">Pagamento Pendente</span>
                <p className="text-xs text-red-700/80 leading-relaxed">
                    <span className="font-medium">{payment.vendorName}</span> vence em {payment.daysLeft} dias.
                </p>
            </div>
        </div>
    );
}
