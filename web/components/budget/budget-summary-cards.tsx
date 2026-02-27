'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BudgetSummaryDTO } from '@/lib/api/budget.api';
import { updateWeddingBudget } from '@/lib/api/weddings.api';
import { DollarSign, Wallet, CheckCircle2, Edit2, Check, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SummaryCardsProps {
    data: Pick<BudgetSummaryDTO, 'totalBudget' | 'contractedTotal' | 'availableAmount'>;
    weddingId: string;
}

export function BudgetSummaryCards({ data, weddingId }: SummaryCardsProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(data.totalBudget.toString());
    const [isSaving, setIsSaving] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const handleSave = async () => {
        const numericValue = Number(inputValue.replace(/[^0-9.-]+/g, ""));
        if (isNaN(numericValue) || numericValue <= 0) return;

        setIsSaving(true);
        try {
            await updateWeddingBudget(weddingId, numericValue);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to update budget:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setInputValue(data.totalBudget.toString());
        setIsEditing(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-semibold text-lg text-text-primary">Resumo Financeiro</h3>
                <Link href="/fornecedores" className="bg-[#e8306e] text-white px-4 py-2 text-sm font-medium rounded-full shadow-sm shadow-[#e8306e]/20 flex items-center gap-1.5 hover:bg-[#e8306e]/90 transition-all">
                    <span>Novo Pagamento</span>
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Card className="col-span-2 shadow-soft border-none bg-white">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3 w-full">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div className="flex-1 w-full">
                                <span className="text-xs uppercase tracking-wide text-text-secondary font-medium">Orçamento Total</span>

                                {isEditing ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            autoFocus
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className="text-xl font-bold text-text-primary bg-gray-50 border border-gray-200 rounded px-2 w-32 outline-none focus:ring-2 focus:ring-primary/20"
                                            disabled={isSaving}
                                        />
                                        <button onClick={handleSave} disabled={isSaving} className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </button>
                                        <button onClick={handleCancel} disabled={isSaving} className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mt-0.5 group">
                                        <p className="text-2xl font-bold text-text-primary">{formatCurrency(data.totalBudget)}</p>
                                        <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-none bg-white">
                    <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wide text-text-secondary font-medium">Contratado</span>
                        </div>
                        <p className="text-lg font-bold text-text-primary">{formatCurrency(data.contractedTotal)}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-none bg-white">
                    <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-7 w-7 rounded-full bg-success/10 flex items-center justify-center text-success">
                                <Wallet className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wide text-text-secondary font-medium">Disponível</span>
                        </div>
                        <p className="text-lg font-bold text-success">{formatCurrency(data.availableAmount)}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
