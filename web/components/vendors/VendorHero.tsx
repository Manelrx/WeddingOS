"use client";

import React from 'react';
import Image from 'next/image';

interface VendorHeroProps {
    imageSrc?: string;
    price?: string;
    statusLabel?: string;
    categoryLabel?: string;
}

export function VendorHero({
    imageSrc = "https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2000&auto=format&fit=crop",
    price = "R$ 45.000",
    statusLabel = "Analisando",
    categoryLabel = "Orçamento Estimado"
}: VendorHeroProps) {
    return (
        <div className="flex flex-col space-y-6 mb-8 px-6 pt-2">
            <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden shadow-soft relative group bg-slate-100/50">
                <Image
                    src={imageSrc}
                    alt="Venue"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            <div className="flex items-end justify-between px-1">
                <div className="flex flex-col space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        {categoryLabel}
                    </span>
                    <span className="text-[2.5rem] leading-none font-serif text-text-primary">
                        {price}
                    </span>
                </div>

                <div className="px-4 py-1.5 mb-1 rounded-full bg-accent-blue border border-accent-blue/50">
                    <span className="text-xs font-bold tracking-wide text-accent-blue-text uppercase">
                        {statusLabel}
                    </span>
                </div>
            </div>
        </div>
    );
}
