import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { DashboardData } from '@/lib/mocks/home-dashboard';

interface InsightCardProps {
    data: DashboardData['greeting']['quote'];
}

export function InsightCard({ data }: InsightCardProps) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-semibold leading-none tracking-tight text-lg text-foreground">
                Humor do Dia
            </h3>
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex flex-col gap-4 relative">
                    <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                    <p className="text-sm italic text-foreground/80 leading-relaxed font-serif">
                        "{data.text}"
                    </p>
                    <span className="text-xs font-medium text-muted-foreground text-right block">
                        — {data.author}
                    </span>
                </CardContent>
            </Card>
        </div>
    );
}
