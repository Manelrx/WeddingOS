import React from 'react';
import { Container } from '@/components/layout/container';
import { Calendar } from 'lucide-react';
import { DashboardData } from '@/lib/mocks/home-dashboard';

interface HeaderProps {
    data: DashboardData['greeting'];
}

export function Header({ data }: HeaderProps) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Olá, {data.names.join(' & ')}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {data.daysRemaining} dias para o grande dia
                </span>
            </div>
        </div>
    );
}
