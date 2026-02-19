import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function FloatingActionButton() {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <Link href="/fornecedores/novo">
                <button className="bg-gradient-to-br from-[#D4C092] to-[#C5A96F] text-white h-14 pl-5 pr-6 rounded-2xl shadow-[0_10px_25px_-5px_rgba(197,169,111,0.4)] flex items-center gap-2 font-medium tracking-wide transition-all hover:scale-105 active:scale-95 hover:shadow-lg">
                    <Plus className="w-6 h-6" />
                    Novo fornecedor
                </button>
            </Link>
        </div>
    );
}
