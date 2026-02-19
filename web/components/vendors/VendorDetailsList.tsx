import React from 'react';
import { Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendorDetailsListProps {
    remainingBalance: number;
    paymentConditions: string;
}

export function VendorDetailsList({ remainingBalance, paymentConditions }: VendorDetailsListProps) {
    const formattedBalance = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(remainingBalance);

    const items = [
        {
            text: `Saldo Restante: ${formattedBalance}`,
            hasInfo: true,
            tooltip: "Valor a ser pago conforme condições."
        },
        {
            text: `Condições: ${paymentConditions}`,
            hasInfo: false
        }
    ];

    return (
        <section className="space-y-6 mb-10 px-6">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-serif text-text-primary">Financeiro</h2>
            </div>

            <div className="bg-background-card rounded-2xl shadow-soft border border-divider overflow-hidden">
                <div className="divide-y divide-divider/60">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "p-4 flex items-start gap-4 hover:bg-amber-soft/30 transition-colors",
                                item.hasInfo && "cursor-help group"
                            )}
                            title={item.tooltip}
                        >
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-accent-gold/10 border border-accent-gold flex items-center justify-center shrink-0">
                                <Check className="w-[14px] h-[14px] text-accent-gold" strokeWidth={3} />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-[15px] text-text-secondary leading-relaxed font-light">
                                        {item.text}
                                    </p>
                                    {item.hasInfo && (
                                        <Info className="w-4 h-4 text-accent-gold/60 -mt-0.5" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
