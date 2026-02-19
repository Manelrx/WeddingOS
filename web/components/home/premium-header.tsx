import React from 'react';
import { PremiumDashboardData } from '@/types/premium-dashboard';
import { CountdownCircle } from './countdown-circle';

interface PremiumHeaderProps {
    data: PremiumDashboardData['greeting'];
}

export function PremiumHeader({ data }: PremiumHeaderProps) {
    return (
        <div className="flex flex-col items-center text-center gap-6 pt-4">
            <div className="space-y-1">
                <span className="text-sm font-medium tracking-widest uppercase text-text-secondary">
                    WeddingOS
                </span>
                <h1 className="text-3xl font-serif text-text-primary tracking-tight">
                    Olá, {data.names.join(' & ')}
                </h1>
            </div>

            <CountdownCircle days={data.daysRemaining} />
        </div>
    );
}
