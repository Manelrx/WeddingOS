"use client";

import React from 'react';
import { ChevronLeft, MoreHorizontal, Star, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VendorHeaderProps {
    name?: string;
    category?: string;
    status?: 'included' | 'not_included' | 'not_informed';
    location?: string;
    rating?: number;
}

export function VendorHeader({
    name = "Buffet Fasano",
    category = "Gastronomia",
    status = "included",
    location = "São Paulo, SP",
    rating = 4.8
}: VendorHeaderProps) {
    const router = useRouter();

    const statusStyles = {
        included: "bg-emerald-50 text-emerald-700 border-emerald-100",
        not_included: "bg-slate-50 text-slate-600 border-slate-100",
        not_informed: "bg-white text-slate-400 border-dashed border-slate-200"
    };

    const statusLabels = {
        included: "Contratado",
        not_included: "Em negociação",
        not_informed: "Não informado"
    };

    return (
        <div className="w-full mb-8">
            <div className="flex items-center gap-2 mb-6 text-slate-400 hover:text-slate-600 transition-colors w-fit cursor-pointer" onClick={() => router.back()}>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Voltar</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-6">
                    {/* Vendor Avatar Placeholder */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shrink-0 border border-slate-100 shadow-inner">
                        {name.charAt(0)}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-serif text-text-primary tracking-tight">
                                {name}
                            </h1>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border",
                                statusStyles[status]
                            )}>
                                {statusLabels[status]}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-text-secondary text-sm">
                            <span className="font-medium px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100 text-slate-600">
                                {category}
                            </span>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>{rating}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors border border-transparent hover:border-slate-100">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
            </div>
        </div>
    );
}
