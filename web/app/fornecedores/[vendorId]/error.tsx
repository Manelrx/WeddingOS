
'use client';

import { useEffect } from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { VendorNavbar } from '@/components/vendors/VendorNavbar';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: number };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Vendor detail error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background-warm font-sans relative flex flex-col">
            <VendorNavbar title="Erro" subtitle="" />

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-100">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>

                <h2 className="text-xl font-serif text-text-primary mb-2">
                    Não foi possível carregar o fornecedor
                </h2>

                <p className="text-sm text-text-muted mb-8 leading-relaxed max-w-xs">
                    Tivemos um problema ao buscar os detalhes. Por favor, tente novamente.
                </p>

                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-divider rounded-xl shadow-sm hover:shadow-md hover:border-accent-gold/40 transition-all text-text-secondary font-medium text-sm"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Tentar novamente
                </button>
            </main>
        </div>
    );
}
