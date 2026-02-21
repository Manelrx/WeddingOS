'use client';

import { Calendar } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns"; interface StepBasicsProps {
    data: {
        coupleNames: string;
        eventDate: string;
        guestCount: number;
    };
    updateData: (fields: Partial<StepBasicsProps['data']>) => void;
}

export function StepBasics({ data, updateData }: StepBasicsProps) {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-2">
                <h2 className="text-3xl font-serif text-gray-900 leading-tight">
                    Primeiro, como<br />
                    vocês se chamam?
                </h2>
                <p className="text-taupe">Vamos personalizar a sua experiência.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="names" className="text-sm font-medium text-gray-700">Nomes do Casal</label>
                    <input
                        id="names"
                        placeholder="Ex: João e Maria"
                        className="flex w-full rounded-md border h-12 border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-gold-400 focus:border-gold-400"
                        value={data.coupleNames}
                        onChange={(e) => updateData({ coupleNames: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Já tem uma data em mente?</label>
                    <DatePicker
                        date={data.eventDate ? new Date(`${data.eventDate}T00:00:00`) : undefined}
                        setDate={(newDate) => {
                            if (newDate) {
                                updateData({ eventDate: format(newDate, 'yyyy-MM-dd') });
                            } else {
                                updateData({ eventDate: '' });
                            }
                        }}
                    />
                    <p className="text-xs text-taupe-light">Pode ser uma estimativa por enquanto.</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="guests" className="text-sm font-medium text-gray-700">Expectativa de Convidados</label>
                    <input
                        id="guests"
                        type="number"
                        placeholder="Ex: 150"
                        min="1"
                        className="flex w-full rounded-md border h-12 border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-gold-400 focus:border-gold-400"
                        value={data.guestCount || ''}
                        onChange={(e) => updateData({ guestCount: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </div>
        </div>
    );
}
