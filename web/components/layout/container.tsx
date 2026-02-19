import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
    return (
        <div
            className={cn(
                "w-full max-w-md mx-auto px-6 py-6 flex flex-col gap-8 min-h-screen bg-background relative overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
