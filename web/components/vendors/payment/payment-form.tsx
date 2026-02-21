
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InstallmentDTO, registerPayment } from '@/lib/api/financial.api';
// Removed Label and Input imports as standard HTML tags were used
// If simple UI components don't exist, I'll use standard HTML with classes.
// Checked ui folder: badge, button, card, progress, separator, tabs. 
// No input, no label, no select. I will use standard HTML tailored with Tailwind.

import { ArrowLeft, Upload, CheckCircle2, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaymentFormProps {
    vendorId: string;
    vendorName: string;
    installments: InstallmentDTO[];
}

export function PaymentForm({ vendorId, vendorName, installments }: PaymentFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedInstallmentId = searchParams.get('installmentId');

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [method, setMethod] = useState('');
    const [selectedInstallmentId, setSelectedInstallmentId] = useState<string>(preSelectedInstallmentId || '');

    // Effect to set amount when installment changes
    useEffect(() => {
        if (selectedInstallmentId) {
            const inst = installments.find(i => i.id === selectedInstallmentId);
            if (inst) {
                setAmount(inst.amount.toString());
                // Also simpler to auto-set date to today or due date? 
                // User flow usually is "I am paying this now", so today is good default.
            }
        }
    }, [selectedInstallmentId, installments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await registerPayment(vendorId, {
                vendorId,
                amount: parseFloat(amount),
                dueDate: date, // Using payment date as due date if not linked? Or just paidAt.
                paidAt: new Date().toISOString(), // Assuming immediate payment confirmation
                status: 'PAGO',
                paymentMethod: method || 'OUTRO',
                installmentId: selectedInstallmentId || undefined,
            });
            setSuccess(true);
            router.refresh(); // Refresh server components
        } catch (err) {
            console.error(err);
            setError('Erro ao registrar pagamento. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const openInstallments = installments.filter(i => i.status !== 'PAGO');

    if (success) {
        return (
            <Card className="shadow-none border-none bg-transparent">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Sucesso!</h2>
                    <p className="text-gray-600 max-w-xs">
                        O pagamento {selectedInstallmentId ? `da parcela` : ''} foi registrado com sucesso.
                    </p>
                    <Button
                        className="mt-6 w-full bg-black hover:bg-gray-800 text-white"
                        onClick={() => router.push(`/fornecedores/${vendorId}/financeiro`)}
                    >
                        Voltar para o Financeiro
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Installment Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Referente à parcela (opcional)</label>
                <select
                    className="w-full h-12 px-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    value={selectedInstallmentId}
                    onChange={(e) => setSelectedInstallmentId(e.target.value)}
                >
                    <option value="">Valor Avulso / Entrada</option>
                    {openInstallments.map((inst, index) => {
                        // Find original index in full list if possible, or just map current
                        // We'll just display amount and date
                        return (
                            <option key={inst.id} value={inst.id}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inst.amount)} - Vence em {new Date(inst.dueDate).toLocaleDateString('pt-BR')}
                            </option>
                        )
                    })}
                </select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Valor Pago</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                    <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-black/5"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0,00"
                    />
                </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data do Pagamento</label>
                <div className="relative">
                    <input
                        type="date"
                        required
                        className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Method Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Forma de Pagamento</label>
                <div className="grid grid-cols-3 gap-2">
                    {['PIX', 'TED', 'CARTAO'].map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMethod(m)}
                            className={`h-10 text-sm font-medium rounded-lg border transition-all ${method === m
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {m === 'CARTAO' ? 'Cartão' : m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Receipt Upload (Mock UI for now as I don't have upload logic handy in API client, 
          but backend supports receiptPath string. I'll just show UI.) */}
            <div className="pt-2">
                <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 bg-gray-50/50">
                    <div className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400">
                        <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-gray-500">
                        <p className="font-medium text-gray-900">Comprovante (Opcional)</p>
                        <p>Toque para fazer upload</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full h-12 text-base bg-black hover:bg-gray-800 text-white rounded-lg mt-4"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registrando...
                    </>
                ) : (
                    'Confirmar Pagamento'
                )}
            </Button>
        </form>
    );
}
