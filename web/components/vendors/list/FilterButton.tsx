"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterButtonProps {
    categories?: string[];
    selected?: string;
    onChange?: (category: string) => void;
}

export function FilterButton({ categories = [], selected = 'Todos', onChange }: FilterButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const allCategories = ['Todos', ...categories];

    return (
        <div className="mb-8 relative z-30" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-background-cream text-left flex items-center justify-between px-5 py-4 rounded-2xl shadow-sm border border-stone-200/60 hover:border-accent-gold/30 transition-all active:scale-[0.99] outline-none focus:ring-2 focus:ring-accent-gold/20"
            >
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-text-muted" />
                    <div>
                        <span className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-0.5">
                            Filtrar por tipo
                        </span>
                        <span className="block text-sm font-medium text-text-main">
                            {selected}
                        </span>
                    </div>
                </div>
                <ChevronDown className={cn(
                    "w-5 h-5 text-text-muted transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-surface-card rounded-xl shadow-[0_12px_30px_-4px_rgba(61,52,48,0.12)] border border-stone-100 overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="py-1">
                        {allCategories.map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    if (onChange) onChange(item);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full px-5 py-3 hover:bg-stone-50 transition-colors flex items-center justify-between text-left",
                                    selected === item ? 'text-text-main font-medium' : 'text-text-muted'
                                )}
                            >
                                <span className="text-sm">{item}</span>
                                {selected === item && <Check className="w-4 h-4 text-accent-gold" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
