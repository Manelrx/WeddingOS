import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PremiumDashboardData } from '@/types/premium-dashboard';
import { AlertCard } from './alert-card';

interface PlanningStatusProps {
    data: PremiumDashboardData['planning'];
}

export function PlanningStatus({ data }: PlanningStatusProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-semibold text-lg text-text-primary">Status do Planejamento</h3>
                <span className="text-sm font-medium text-primary">{data.progress}%</span>
            </div>

            <Card className="shadow-soft border-none">
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-text-secondary uppercase tracking-wider">
                            <span>Progresso Geral</span>
                        </div>
                        <Progress value={data.progress} className="h-2" />
                    </div>

                    {data.pendingPayment && <AlertCard payment={data.pendingPayment} />}

                    <div className="pt-2 border-t border-border flex justify-between items-center text-sm">
                        <span className="text-text-secondary">Lista de Convidados</span>
                        <span className="text-text-primary font-medium">{data.guestList.pending} pendentes</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
