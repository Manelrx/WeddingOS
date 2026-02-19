import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { PremiumDashboardData } from '@/types/premium-dashboard';

interface GuestSummaryProps {
    data: PremiumDashboardData['planning']['guestList'];
}

export function GuestSummary({ data }: GuestSummaryProps) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg text-text-primary px-1">Visão Geral Convidados</h3>
            <Card className="shadow-soft border-none bg-white">
                <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-text-primary">Lista de Convidados</span>
                            <span className="text-xs text-text-secondary mt-0.5">
                                {data.pending} convidados ainda não confirmados
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-serif text-text-primary">{data.confirmed}</span>
                        <span className="text-xs text-text-secondary block font-medium">Confirmados</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
