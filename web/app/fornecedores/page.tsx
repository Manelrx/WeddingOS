import React from 'react';
import { VendorsLayout } from '@/components/vendors/layout/VendorsLayout';
import { TopBar } from '@/components/vendors/layout/TopBar';
import { InsightCard } from '@/components/vendors/list/InsightCard';
import { FilterButton } from '@/components/vendors/list/FilterButton';
import { VendorListCard } from '@/components/vendors/list/VendorListCard';
import { FloatingActionButton } from '@/components/vendors/list/FloatingActionButton';
import { getVendorsByWedding } from '@/lib/api/vendors.api';
import { getMyWedding } from '@/lib/api/weddings.api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface VendorsPageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
<<<<<<< HEAD
    const params = await searchParams;

    const cookieStore = await cookies();
    const token = cookieStore.get('weddingos_token')?.value;

    if (!token) {
        redirect("/login");
    }
=======
    // Temporary hardcoded ID as per instructions
    const weddingId = "857cfa73-9305-4b00-84e2-7746eed73ab8";
    const params = await searchParams;
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208

    let vendors: Awaited<ReturnType<typeof getVendorsByWedding>> = [];
    try {
        const wedding = await getMyWedding(token);
        const result = await getVendorsByWedding(wedding.id, undefined, token);
        vendors = result || [];
    } catch (error) {
        console.error("Failed to fetch vendors:", error);
    }

    const negotiatingCount = vendors.filter(v => v.stage === 'NEGOCIACAO').length;

    // Extract unique categories
    const categories = Array.from(new Set(vendors.map(v => v.category).filter(Boolean)));
    const selectedCategory = params?.category;

    // Filter vendors
    const filteredVendors = selectedCategory
        ? vendors.filter(v => v.category === selectedCategory)
        : vendors;

    return (
        <>
            <TopBar />
            <VendorsLayout>
                <header className="mb-6">
                    <h2 className="text-4xl font-serif text-text-main mb-2 leading-tight">Fornecedores</h2>
                    <p className="text-sm text-text-muted font-normal leading-relaxed">
                        Seu espaço de decisão guiada.
                    </p>
                </header>

                <InsightCard negotiatingCount={negotiatingCount} />

                <FilterButton
                    categories={categories}
                    selected={selectedCategory}
                />

                {filteredVendors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📋</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-serif text-text-main">
                                {selectedCategory ? `Nenhum fornecedor de ${selectedCategory}` : 'Nenhum fornecedor ainda'}
                            </h3>
                            <p className="text-sm text-text-muted max-w-xs mx-auto">
                                {selectedCategory ? 'Tente selecionar outra categoria ou adicione um novo.' : 'Adicione fornecedores para começar a organizar seu casamento.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredVendors.map((vendor) => (
                            <VendorListCard
                                key={vendor.id}
                                vendor={vendor}
                            />
                        ))}
                    </div>
                )}

                <FloatingActionButton />
            </VendorsLayout>
        </>
    );
}

