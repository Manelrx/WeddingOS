import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PremiumDashboardData } from '@/types/premium-dashboard';
import { ChevronRight } from 'lucide-react';

interface OpenDecisionsProps {
    data: PremiumDashboardData['decisions'];
}

export function OpenDecisions({ data }: OpenDecisionsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'analyzing': return 'bg-amber-100 text-amber-700';
            case 'negotiating': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'analyzing': return 'Em Análise';
            case 'negotiating': return 'Negociação';
            default: return 'Pendente';
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg text-text-primary px-1">Decisões Abertas</h3>
            <div className="space-y-3">
                {data.map((decision) => (
                    <Card key={decision.id} className="cursor-pointer hover:shadow-md transition-all duration-300 border-none bg-white shadow-sm group">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusColor(decision.status)}`}>
                                        {getStatusLabel(decision.status)}
                                    </span>
                                    {decision.priority === 'high' && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                                    )}
                                </div>
                                <span className="font-medium text-text-primary group-hover:text-navy transition-colors">
                                    {decision.title}
                                </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
