import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardData } from '@/lib/mocks/home-dashboard';

interface PlanningOverviewProps {
    data: DashboardData['planning'];
}

export function PlanningOverview({ data }: PlanningOverviewProps) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle>Status do Planejamento</CardTitle>
            </CardHeader>
            <CardContent className="px-0 flex flex-col gap-4">
                {/* Progress Section */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso Geral</span>
                        <span className="font-semibold text-primary">{data.progress}%</span>
                    </div>
                    <Progress value={data.progress} className="h-2" />
                </div>

                {/* Pending Payment Alert */}
                <div className="rounded-lg border border-red-100 bg-red-50 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-semibold text-red-900">
                            Pagamento Pendente
                        </h4>
                        <p className="text-xs text-red-700">
                            Vence em {data.pendingPayment.daysLeft} dias • {data.pendingPayment.vendorName}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
