"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface VendorNavbarProps {
    title?: string;
    subtitle?: string;
    onEdit?: () => void;
}

export function VendorNavbar({ title = "Villa Giardini", subtitle = "Local da Cerimônia", onEdit }: VendorNavbarProps) {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "sticky top-0 z-50 transition-all duration-300 border-b",
            scrolled ? "bg-background-warm/95 backdrop-blur-md border-divider shadow-sm" : "bg-transparent border-transparent"
        )}>
            <div className="px-5 h-16 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors text-text-secondary"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <motion-div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : -10 }}
                    className="flex flex-col items-center"
                >
                    <h1 className="text-lg font-serif font-semibold text-text-primary leading-tight">{title}</h1>
                    <span className="text-[10px] font-sans tracking-widest uppercase text-text-muted mt-0.5">{subtitle}</span>
                </motion-div>

                <button
                    onClick={onEdit}
                    className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors text-text-secondary"
                >
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}

// Simple internal wrapper for framer motion to avoid client/server issues in this file if needed, 
// strictly speaking regular div with conditionally applied classes works too, 
// but using a simple opacity transition with CSS classes is safer for server components/nextjs 13+ patterns often.
function motion_div({ children, className, animate }: any) {
    // simplified for brevity/reliability without heavy deps, 
    // actually let's use standard CSS transition for opacity as generic logic.
    return (
        <div className={cn(className, "transition-all duration-300",
            animate.opacity === 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}>
            {children}
        </div>
    )
}
const motion = { div: motion_div };
// Renaming strictly for this file to match logic. 
const MotionDiv = motion_div; 
