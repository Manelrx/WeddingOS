import React from 'react';
import { Clock, Zap, ParkingCircle } from 'lucide-react';

interface AttentionCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
}

function AttentionCard({ title, description, icon: Icon }: AttentionCardProps) {
    return (
        <div className="bg-white border border-amber-border rounded-xl p-4 flex gap-4 shadow-sm relative overflow-hidden group hover:shadow-soft transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-text/20 group-hover:bg-amber-text/40 transition-colors" />

            <div className="mt-1 w-8 h-8 rounded-lg bg-amber-icon-bg flex items-center justify-center shrink-0 border border-amber-border">
                <Icon className="w-[18px] h-[18px] text-amber-text" />
            </div>

            <div className="space-y-1.5 flex-1">
                <p className="text-[11px] font-bold text-amber-text tracking-widest uppercase">
                    {title}
                </p>
                <p className="text-[14px] text-text-secondary leading-relaxed font-light">
                    {description}
                </p>
            </div>
        </div>
    );
}

export function VendorAttentionCards() {
    const cards = [
        {
            title: "Restrição de Horário",
            description: "Para respeitar a vizinhança e a lei do silêncio, o som na área externa precisa ser desligado às 22:00h.",
            icon: Clock
        },
        {
            title: "Taxa de Gerador",
            description: "O uso do gerador é cobrado à parte caso o consumo exceda 4 horas contínuas.",
            icon: Zap
        },
        {
            title: "Estacionamento Limitado",
            description: "Capacidade para apenas 20 veículos no local. Sugerimos serviço de valet terceirizado.",
            icon: ParkingCircle
        }
    ];

    return (
        <section className="space-y-4 px-6 pb-24">
            <h2 className="text-xl font-serif text-text-primary px-1">Pontos de atenção</h2>
            <div className="flex flex-col gap-3">
                {cards.map((card, index) => (
                    <AttentionCard
                        key={index}
                        {...card}
                    />
                ))}
            </div>
        </section>
    );
}
