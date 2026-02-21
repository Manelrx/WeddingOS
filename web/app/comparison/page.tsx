"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Utensils, Camera, Music, Church, Flower2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

const CATEGORIES = [
    {
        id: "buffet",
        title: "Buffet",
        subtitle: "Opções de gastronomia",
        icon: Utensils,
        color: "bg-orange-50 text-orange-600",
    },
    {
        id: "fotografia",
        title: "Fotografia",
        subtitle: "Eternizando momentos",
        icon: Camera,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "musica",
        title: "Música",
        subtitle: "Bandas e DJs",
        icon: Music,
        color: "bg-purple-50 text-purple-600",
    },
    {
        id: "local",
        title: "Local da cerimônia",
        subtitle: "Onde tudo acontece",
        icon: Church,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "decoracao",
        title: "Decoração",
        subtitle: "Cuidando dos detalhes",
        icon: Flower2,
        color: "bg-rose-50 text-rose-600",
    },
];

export default function CategorySelectionPage() {
    const router = useRouter();

    return (
        <Container className="py-8 pb-24">
            <header className="mb-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="mb-6 -ml-2"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Button>
                <h1 className="text-3xl font-serif text-slate-900 leading-tight mb-2">
                    O que vocês querem<br />decidir agora?
                </h1>
                <p className="text-slate-500">Escolha o tipo de serviço para comparar.</p>
            </header>

            <div className="space-y-4">
                {CATEGORIES.map((cat) => (
                    <Card
                        key={cat.id}
                        onClick={() => router.push(`/comparison/${cat.id}`)}
                        className="p-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] border-none shadow-sm group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color}`}>
                                <cat.icon className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">{cat.title}</h3>
                                <p className="text-sm text-slate-500">{cat.subtitle}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-2 h-2 rounded-full bg-rose-100 animate-pulse" />
            </div>
        </Container>
    );
}
