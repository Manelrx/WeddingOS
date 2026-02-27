'use client';

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

<<<<<<< HEAD
import { SetupWeddingPayload } from "@/lib/api/weddings.api";

=======
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
export interface ServiceExpectedBudget {
    type: string;
    expectedValue: number;
}

interface StepServicesProps {
<<<<<<< HEAD
    data: SetupWeddingPayload;
    updateData: (fields: Partial<SetupWeddingPayload>) => void;
=======
    data: {
        services: ServiceExpectedBudget[];
    };
    updateData: (fields: Partial<StepServicesProps['data']>) => void;
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
}

// Pre-defined popular categories 
const COMMON_SERVICES = [
    { id: 'espaco', label: 'Espaço / Local', icon: '🏰' },
    { id: 'buffet', label: 'Buffet & Bebidas', icon: '🍽️' },
    { id: 'fotografia', label: 'Fotografia', icon: '📸' },
    { id: 'video', label: 'Filmagem', icon: '🎥' },
    { id: 'decoracao', label: 'Decoração', icon: '🌸' },
    { id: 'assessoria', label: 'Assessoria / Cerimonial', icon: '📋' },
    { id: 'musica_festa', label: 'Banda / DJ', icon: '🎵' },
    { id: 'vestido', label: 'Vestido da Noiva', icon: '👗' },
    { id: 'maquiagem', label: 'Cabelo e Maquiagem', icon: '💄' },
    { id: 'convites', label: 'Convites / Papelaria', icon: '💌' },
    { id: 'doces', label: 'Doces e Bolo', icon: '🍰' },
    { id: 'lembrancinhas', label: 'Lembrancinhas', icon: '🎁' },
];

export function StepServices({ data, updateData }: StepServicesProps) {

    const handleToggleService = (serviceId: string, label: string) => {
<<<<<<< HEAD
        const currentServices = data.services || [];
        const exists = currentServices.find(s => s.type === label);
        if (exists) {
            updateData({ services: currentServices.filter(s => s.type !== label) });
        } else {
            updateData({ services: [...currentServices, { type: label, expectedValue: 0 }] });
=======
        const exists = data.services.find(s => s.type === label);
        if (exists) {
            updateData({ services: data.services.filter(s => s.type !== label) });
        } else {
            updateData({ services: [...data.services, { type: label, expectedValue: 0 }] });
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
        }
    };

    const handleBudgetChange = (label: string, valueString: string) => {
        const unformatted = valueString.replace(/\D/g, '');
        const numericValue = parseInt(unformatted) || 0;
<<<<<<< HEAD
        const currentServices = data.services || [];

        const newServices = currentServices.map(s =>
=======

        const newServices = data.services.map(s =>
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208
            s.type === label ? { ...s, expectedValue: numericValue } : s
        );
        updateData({ services: newServices });
    };

    const formatCurrency = (val: number) => {
        if (val === 0) return '';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-2">
                <h2 className="text-3xl font-serif text-gray-900 leading-tight">
                    O time dos sonhos
                </h2>
                <p className="text-taupe">Selecione os serviços essenciais para o seu casamento e qual a expectativa de custo para cada um.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar pb-10">
                {COMMON_SERVICES.map((service) => {
<<<<<<< HEAD
                    const isSelected = (data.services || []).find(s => s.type === service.label);
=======
                    const isSelected = data.services.find(s => s.type === service.label);
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208

                    return (
                        <div key={service.id} className="flex flex-col gap-2">
                            <button
                                onClick={() => handleToggleService(service.id, service.label)}
                                className={cn(
                                    "relative p-4 rounded-xl border text-left transition-all duration-200 flex flex-col items-start gap-2 focus:outline-none focus:ring-2 focus:ring-gold-400",
                                    isSelected
                                        ? "bg-ivory-50 border-gold-400 shadow-sm"
                                        : "bg-white border-gray-100 hover:border-gray-300"
                                )}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 bg-gold-400 text-white p-0.5 rounded-full">
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                )}
                                <span className="text-2xl">{service.icon}</span>
                                <span className={cn("text-sm font-medium", isSelected ? "text-gray-900" : "text-gray-600")}>
                                    {service.label}
                                </span>
                            </button>

                            {/* Inline Budget Input if Selected */}
                            {isSelected && (
                                <div className="animate-slide-up pl-1 pr-1">
                                    <label className="text-xs text-taupe block mb-1">Custo esperado:</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="w-full text-sm font-medium text-gray-900 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gold-400 transition-colors pb-1"
                                        value={formatCurrency(isSelected.expectedValue)}
                                        placeholder="R$ 0,00"
                                        onChange={(e) => handleBudgetChange(service.label, e.target.value)}
                                        onClick={(e) => e.stopPropagation()} // prevent toggling the card if clicking nearby
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
