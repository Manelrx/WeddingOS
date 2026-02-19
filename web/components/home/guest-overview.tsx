import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { DashboardData } from '@/lib/mocks/home-dashboard';

interface GuestOverviewProps {
    data: DashboardData['planning']['guestList'];
}

export function GuestOverview({ data }: GuestOverviewProps) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-semibold leading-none tracking-tight text-lg text-foreground">
                Visão Geral Convidados
            </h3>
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">Lista de Convidados</span>
                            <span className="text-xs text-muted-foreground">
                                {data.unconfirmedCount} convidados ainda não confirmados
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
