"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { getVendorsByWedding } from "@/lib/api/vendors.api";
import { VendorSummary } from "@/types/vendor.types";

const DEMO_WEDDING_ID = '857cfa73-9305-4b00-84e2-7746eed73ab8';

export default function VendorSelectionClient({ service }: { service: string }) {
    const router = useRouter();
    const [vendors, setVendors] = useState<VendorSummary[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getVendorsByWedding(DEMO_WEDDING_ID, service);
                setVendors(data);
                // By default, select vendors that have at least one proposal
                const autoSelected = data
                    .filter(v => v.proposalCount > 0)
                    .map(v => v.id);
                setSelectedIds(autoSelected);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [service]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCompare = () => {
        if (selectedIds.length < 2) return;
        router.push(`/comparison/${service}/view?vendors=${selectedIds.join(',')}`);
    };

    if (loading) {
        return (
            <Container className="py-8 animate-pulse">
                <div className="h-8 bg-slate-100 rounded w-1/2 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-8 pb-32">
            <header className="mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/comparison')}
                    className="mb-4 -ml-2"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Button>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Quais fornecedores<br />comparar?
                </h1>
                <p className="text-slate-500 text-sm">Selecione pelo menos dois para analisar.</p>
            </header>

            {vendors.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400">Nenhum fornecedor de {service} encontrado.</p>
                    <Button
                        variant="outline"
                        className="mt-6 rounded-full"
                        onClick={() => router.push('/fornecedores')}
                    >
                        Adicionar Fornecedor
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {vendors.map((vendor) => {
                        const isSelected = selectedIds.includes(vendor.id);
                        const hasProposals = vendor.proposalCount > 0;

                        return (
                            <Card
                                key={vendor.id}
                                onClick={() => hasProposals && toggleSelection(vendor.id)}
                                className={`p-4 cursor-pointer transition-all border-2 ${isSelected ? 'border-rose-400 bg-rose-50/30' : 'border-transparent shadow-sm'
                                    } ${!hasProposals ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-500 border-rose-500' : 'border-slate-200 bg-white'
                                        }`}>
                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
                                        <p className="text-xs text-slate-500">
                                            {hasProposals ? `${vendor.proposalCount} proposta(s)` : 'Sem propostas enviadas'}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {selectedIds.length >= 2 && (
                <div className="fixed bottom-8 left-0 right-0 px-6 max-w-md mx-auto z-50">
                    <Button
                        className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 text-lg font-bold"
                        onClick={handleCompare}
                    >
                        Comparar agora
                    </Button>
                </div>
            )}
        </Container>
    );
}
