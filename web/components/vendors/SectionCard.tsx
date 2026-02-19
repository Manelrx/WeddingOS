import React from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    action?: React.ReactNode;
}

export function SectionCard({ children, className, title, action, ...props }: SectionCardProps) {
    return (
        <div
            className={cn(
                "bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50",
                "transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                className
            )}
            {...props}
        >
            {(title || action) && (
                <div className="flex items-center justify-between mb-8">
                    {title && (
                        <h2 className="text-lg font-semibold text-text-primary tracking-tight">
                            {title}
                        </h2>
                    )}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
