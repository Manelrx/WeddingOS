"use client";

import React from 'react';
import { SectionCard } from './SectionCard';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface VendorStatusTimelineProps {
    currentStep?: 'analyzing' | 'negotiating' | 'closed';
}

export function VendorStatusTimeline({ currentStep = 'negotiating' }: VendorStatusTimelineProps) {
    const steps = [
        { id: 'analyzing', label: 'Em Análise' },
        { id: 'negotiating', label: 'Em Negociação' },
        { id: 'closed', label: 'Fechado' },
    ];

    const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
    const currentIndex = getCurrentStepIndex();

    return (
        <SectionCard className="mb-8" title="Status da Contratação">
            <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto py-8 px-4 md:px-12">
                {/* Connection Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10" />

                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-4 bg-card px-2 min-w-[100px]">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-300",
                                isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-100" :
                                    isCurrent ? "bg-white border-primary text-primary shadow-[0_0_0_4px_rgba(198,167,94,0.15)]" :
                                        "bg-slate-50 border-slate-200 text-slate-300"
                            )}>
                                {isCompleted ? <Check className="w-6 h-6" /> :
                                    <span className="text-lg font-bold font-serif">{index + 1}</span>}
                            </div>
                            <span className={cn(
                                "text-sm font-semibold tracking-wide uppercase transition-colors text-center",
                                isCurrent ? "text-primary" :
                                    isCompleted ? "text-emerald-600" :
                                        "text-slate-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </SectionCard>
    );
}
