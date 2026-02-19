import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { PremiumDashboardData } from '@/types/premium-dashboard';

interface DailyMoodProps {
    data: PremiumDashboardData['greeting']['quote'];
}

export function DailyMood({ data }: DailyMoodProps) {
    return (
        <div className="space-y-4 pt-4">
            <h3 className="font-semibold text-lg text-text-primary px-1">Humor do Dia</h3>
            <Card className="bg-navy border-none shadow-lg text-white relative overflow-hidden">
                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                <CardContent className="p-8 flex flex-col gap-6 relative z-10">
                    <Quote className="w-8 h-8 text-primary/80" />
                    <p className="text-lg font-serif italic text-white/90 leading-relaxed tracking-wide">
                        "{data.text}"
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="h-[1px] w-8 bg-primary/50" />
                        <span className="text-xs font-medium text-white/60 tracking-widest uppercase">
                            {data.author}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
