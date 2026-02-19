"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface VendorStickyFooterProps {
    status: string;
}

export function VendorStickyFooter({ status }: VendorStickyFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-divider pb-8 pt-6 px-6 z-40 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-3 max-w-md mx-auto">
                <button className="w-full bg-accent-gold hover:bg-accent-gold-dark text-white font-sans font-medium py-4 rounded-xl shadow-lg shadow-accent-gold/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 tracking-wide text-[15px]">
                    {status === 'closed' ? 'Contrato Assinado' : 'Avançar para negociação'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                {status !== 'closed' && (
                    <div className="grid grid-cols-2 gap-3">
                        {/* We can make these interactive later */}
                    </div>
                )}
            </div>
        </div>
    );
}
