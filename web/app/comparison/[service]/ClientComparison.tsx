"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { TiraTeimaView } from "@/components/comparison/TiraTeimaView";
import { LupaView } from "@/components/comparison/LupaView";
import { CiladaView } from "@/components/comparison/CiladaView";
import { ComparisonMatrix } from "@/app/types/comparison";
import { getComparison } from "@/lib/api/comparison.api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type TabMode = "tira-teima" | "lupa" | "cilada";
const DEMO_WEDDING_ID = '857cfa73-9305-4b00-84e2-7746eed73ab8';

export default function ComparisonClient({ service }: { service: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vendorIds = searchParams.get('vendors')?.split(',') || [];

    const serviceType = service;

    const [activeTab, setActiveTab] = useState<TabMode>("tira-teima");
    const [data, setData] = useState<ComparisonMatrix | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const matrix = await getComparison(DEMO_WEDDING_ID, serviceType, vendorIds);
                setData(matrix);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [serviceType, searchParams]);

    if (loading) {
        return <ComparisonSkeleton />;
    }

    if (!data) return <div>Erro ao carregar dados da comparação.</div>;

    const tabOptions = [
        { id: "tira-teima", label: "Diferenças" },
        { id: "lupa", label: "Tudo" },
        { id: "cilada", label: "Riscos" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Fixo */}
            <header className="bg-white sticky top-0 z-30 border-b border-slate-200 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 px-2">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                    <div className="text-center">
                        <h1 className="font-bold text-slate-800 capitalize">
                            {serviceType}
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
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
            <main className="p-4 space-y-6">
                <section>
                    {activeTab === 'tira-teima' && <TiraTeimaView data={data} />}
                    {activeTab === 'lupa' && <LupaView data={data} />}
                    {activeTab === 'cilada' && <CiladaView data={data} />}
                </section>

                {data.aiAnalysis && (
                    <Card className="border-rose-100 bg-rose-50/50 overflow-hidden">
                        <CardHeader className="pb-3 border-b border-rose-100/50 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold text-rose-900 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" />
                                Análise Personalizada IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                {data.aiAnalysis.summary}
                            </p>
                            <ul className="space-y-2">
                                {data.aiAnalysis.highlights.map((highlight, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-rose-800">
                                        <div className="mt-1 w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
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
