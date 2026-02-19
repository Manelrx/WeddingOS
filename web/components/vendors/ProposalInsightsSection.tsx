"use client";

import React from 'react';
import { Lightbulb, ThumbsUp, ThumbsDown, AlertTriangle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProposalInsightsSectionProps {
    strengths?: string[];
    weaknesses?: string[];
    gaps?: string[];
    differentiators?: string[];
}

export function ProposalInsightsSection({ strengths = [], weaknesses = [], gaps = [], differentiators = [] }: ProposalInsightsSectionProps) {
    const hasContent = (arr?: string[]) => arr && arr.length > 0;

    if (!hasContent(strengths) && !hasContent(weaknesses) && !hasContent(gaps) && !hasContent(differentiators)) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Pontos Fortes */}
            {hasContent(strengths) && (
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-green-800">
                        <ThumbsUp className="w-5 h-5" />
                        <h3 className="font-serif font-medium">Pontos Fortes</h3>
                    </div>
                    <ul className="space-y-2">
                        {strengths!.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-green-900/80 leading-relaxed">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-green-400 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Diferenciais */}
            {hasContent(differentiators) && (
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-purple-800">
                        <Star className="w-5 h-5" />
                        <h3 className="font-serif font-medium">Diferenciais</h3>
                    </div>
                    <ul className="space-y-2">
                        {differentiators!.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-purple-900/80 leading-relaxed">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Pontos Fracos */}
            {hasContent(weaknesses) && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-amber-800">
                        <ThumbsDown className="w-5 h-5" />
                        <h3 className="font-serif font-medium">Pontos de Atenção</h3>
                    </div>
                    <ul className="space-y-2">
                        {weaknesses!.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-amber-900/80 leading-relaxed">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Lacunas */}
            {hasContent(gaps) && (
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-red-800">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="font-serif font-medium">Informações Ausentes</h3>
                    </div>
                    <ul className="space-y-2">
                        {gaps!.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-red-900/80 leading-relaxed">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
