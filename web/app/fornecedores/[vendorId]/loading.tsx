
import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-background-warm font-sans pb-44 relative animate-pulse">
            {/* Navbar Skeleton */}
            <div className="h-16 border-b border-divider bg-white/50 backdrop-blur-sm" />

            <main className="max-w-md mx-auto w-full bg-background-warm min-h-screen shadow-2xl shadow-gray-200/50 pt-6 px-6">
                {/* Hero Skeleton */}
                <div className="w-full aspect-video bg-stone-200 rounded-xl mb-6" />
                <div className="h-8 w-3/4 bg-stone-200 rounded mb-2" />
                <div className="h-4 w-1/2 bg-stone-200 rounded mb-8" />

                <div className="h-px bg-divider w-full mb-8 opacity-60" />

                {/* Proposals Skeleton */}
                <div className="h-24 w-full bg-stone-100 rounded-xl mb-4" />
                <div className="h-24 w-full bg-stone-100 rounded-xl mb-4" />
            </main>
        </div>
    );
}
