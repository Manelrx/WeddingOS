"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { TiraTeimaView } from "@/components/comparison/TiraTeimaView";
import { LupaView } from "@/components/comparison/LupaView";
import { CiladaView } from "@/components/comparison/CiladaView";
import { MOCK_COMPARISON_MATRIX } from "@/app/lib/mockData";
import { ComparisonMatrix } from "@/app/types/comparison";

type TabMode = "tira-teima" | "lupa" | "cilada";

export default function ComparisonPage() {
    const params = useParams();
    const router = useRouter();
    const serviceType = params.service as string;

    const [activeTab, setActiveTab] = useState<TabMode>("tira-teima");
    const [data, setData] = useState<ComparisonMatrix | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            // In a real app, we would fetch `/weddings/1/comparisons/${serviceType}`
            // For now, we use the mock data, potentially adjusting the serviceType title
            const mock = { ...MOCK_COMPARISON_MATRIX, serviceType };
            setData(mock);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [serviceType]);

    if (loading) {
        return <ComparisonSkeleton />;
    }

    if (!data) return <div>Erro ao carregar.</div>;

    const tabOptions = [
        { id: "tira-teima", label: "Tira-Teima" },
        { id: "lupa", label: "Lupa" },
        { id: "cilada", label: "Pontos de Atenção" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-10">
            {/* Header Fixo */}
            <header className="bg-white sticky top-0 z-30 border-b border-slate-200 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 px-2">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                    <div className="text-center">
                        <h1 className="font-bold text-slate-800 capitalize">
                            {serviceType === 'buffet' ? 'Buffet & Gastronomia' : serviceType}
                        </h1>
                        <p className="text-xs text-slate-500">
                            {data.proposals.length} propostas comparadas
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" className="-mr-2 px-2 text-rose-500">
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>

                <Tabs
                    options={tabOptions}
                    activeId={activeTab}
                    onChange={(id) => setActiveTab(id as TabMode)}
                />
            </header>

            {/* Main Content */}
            <main className="p-4">
                {activeTab === 'tira-teima' && <TiraTeimaView data={data} />}
                {activeTab === 'lupa' && <LupaView data={data} />}
                {activeTab === 'cilada' && <CiladaView data={data} />}
            </main>
        </div>
    );
}

function ComparisonSkeleton() {
    return (
        <div className="min-h-screen bg-white p-4 space-y-4 animate-pulse">
            <div className="h-12 bg-slate-100 rounded-lg w-full mb-6"></div>
            <div className="h-40 bg-slate-100 rounded-xl w-full"></div>
            <div className="h-40 bg-slate-100 rounded-xl w-full"></div>
            <div className="h-40 bg-slate-100 rounded-xl w-full"></div>
        </div>
    )
}
