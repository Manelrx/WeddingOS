"use client";

import React from 'react';
import { Bell } from 'lucide-react';

export function TopBar() {
    return (
        <div className="fixed top-0 left-0 w-full bg-background-cream/98 backdrop-blur-xl z-50 border-b border-stone-200/30 shadow-[0_1px_2px_rgba(61,52,48,0.03)] transition-all duration-300">
            <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
                <h1 className="text-base font-serif font-bold tracking-[0.15em] text-text-main uppercase">
                    WeddingOS
                </h1>

                <button className="w-10 h-10 flex items-center justify-center rounded-full text-text-main hover:bg-stone-200/50 transition-colors relative group">
                    <Bell className="w-[22px] h-[22px] opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent-gold rounded-full ring-2 ring-background-cream"></span>
                </button>
            </div>
        </div>
    );
}
