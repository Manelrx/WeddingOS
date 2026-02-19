import { useState } from "react";

interface StepSupplierTypeProps {
    onSelect: (type: string) => void;
    selectedType: string;
    onNext: () => void;
}

const supplierTypes = [
    { id: "buffet", label: "Buffet", icon: "restaurant_menu" },
    { id: "photography", label: "Fotografia", icon: "camera_alt" },
    { id: "music", label: "Música / DJ", icon: "music_note" },
    { id: "local", label: "Local", icon: "church" },
    { id: "decoration", label: "Decoração", icon: "yard" }, // 'yard' is closest to TreePalm/Deco in material usually, or 'local_florist'
    { id: "other", label: "Outro", icon: "more_horiz" },
];

export default function StepSupplierType({ onSelect, selectedType, onNext }: StepSupplierTypeProps) {
    return (
        <>
            <div className="flex-1 px-6 overflow-y-auto no-scrollbar">
                <div className="mt-6 mb-8 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-warm-gray leading-tight mb-3 tracking-tight">
                        Que tipo de fornecedor é esse?
                    </h1>
                    <p className="text-warm-gray-light text-sm sm:text-base font-medium">
                        Isso ajuda a organizar e comparar depois.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-6">
                    {supplierTypes.map((type) => {
                        const isSelected = selectedType === type.id;

                        return (
                            <button
                                key={type.id}
                                onClick={() => onSelect(type.id)}
                                className={`group relative flex flex-col items-center justify-center p-6 bg-white border-2 rounded-2xl transition-all duration-300 transform active:scale-95 ${isSelected
                                    ? "border-gold-primary shadow-soft-gold"
                                    : "border-transparent hover:border-gold-primary/30 shadow-card-subtle hover:shadow-soft-gold"
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 text-gold-primary opacity-100 transition-opacity">
                                        <span className="material-icons-outlined text-xl">check_circle</span>
                                    </div>
                                )}
                                <div
                                    className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isSelected ? "bg-gold-primary/10" : "bg-neutral-surface group-hover:bg-gold-primary/20"
                                        }`}
                                >
                                    <span className={`material-icons-outlined text-2xl transition-colors ${isSelected ? "text-gold-primary" : "text-warm-gray-light group-hover:text-gold-primary"
                                        }`}>
                                        {type.icon}
                                    </span>
                                </div>
                                <span
                                    className={`font-semibold transition-colors ${isSelected ? "text-warm-gray" : "text-warm-gray-light group-hover:text-warm-gray"
                                        }`}
                                >
                                    {type.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="p-6 bg-gradient-to-t from-ivory via-ivory to-transparent flex-none z-20">
                <button
                    onClick={onNext}
                    disabled={!selectedType}
                    className={`w-full font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 ${!selectedType
                        ? "bg-warm-gray-light/20 text-warm-gray-light cursor-not-allowed"
                        : "bg-gold-primary hover:bg-gold-hover text-white shadow-gold-primary/30"
                        }`}
                >
                    Continuar
                </button>
            </div>
        </>
    );
}
