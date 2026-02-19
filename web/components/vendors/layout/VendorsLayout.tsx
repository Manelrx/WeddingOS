import React from 'react';
import { cn } from '@/lib/utils';

interface VendorsLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function VendorsLayout({ children, className }: VendorsLayoutProps) {
    return (
        <div className="min-h-screen bg-background-cream font-sans text-text-main relative pb-32">
            <main className={cn("pt-24 px-6 max-w-md mx-auto relative min-h-screen pb-24", className)}>
                {children}
            </main>
        </div>
    );
}
