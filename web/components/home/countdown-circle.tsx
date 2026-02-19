import React from 'react';

interface CountdownCircleProps {
    days: number;
}

export function CountdownCircle({ days }: CountdownCircleProps) {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    // Progress is inverse for countdown logic (optional, keeping static circle for elegance or dynamic based on total timeline)
    // For this design, let's keep a complete elegant circle with the number inside

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="transparent"
                    className="text-muted"
                />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    className="text-primary"
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                />
            </svg>
            <div className="flex flex-col items-center">
                <span className="text-4xl font-serif text-text-primary tabular-nums tracking-tighter">
                    {days}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-text-secondary font-medium mt-1">
                    Dias
                </span>
            </div>
        </div>
    );
}
