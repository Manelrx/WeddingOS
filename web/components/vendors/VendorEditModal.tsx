"use client";

import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { updateVendor, deleteVendor } from '@/lib/api/vendors.api';
import { useRouter } from 'next/navigation';
import { VendorDetail } from '@/types/vendor.types';

interface VendorEditModalProps {
    vendor: VendorDetail;
    onClose: () => void;
}

const categoryOptions = [
    { value: 'Gastronomia', label: 'Gastronomia' },
    { value: 'Fotografia', label: 'Fotografia' },
    { value: 'Decoração', label: 'Decoração' },
    { value: 'Música', label: 'Música' },
    { value: 'Local', label: 'Local' },
    { value: 'Vestuário', label: 'Vestuário' },
    { value: 'Convites', label: 'Convites' },
    { value: 'Filmagem', label: 'Filmagem' },
    { value: 'Cerimonial', label: 'Cerimonial' },
    { value: 'Outros', label: 'Outros' },
];

const stageOptions = [
    { value: 'ORCAMENTO', label: 'Orçamento' },
    { value: 'NEGOCIACAO', label: 'Negociação' },
    { value: 'CONTRATO_EM_ANALISE', label: 'Contrato em Análise' },
    { value: 'CONTRATADO', label: 'Contratado' },
    { value: 'CANCELADO', label: 'Cancelado' },
];

export function VendorEditModal({ vendor, onClose }: VendorEditModalProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: vendor.name,
        serviceType: vendor.category,
        stage: vendor.stage,
        notes: vendor.notes || '',
        estimatedValue: vendor.estimatedValue || 0,
    });

    const handleChange = (field: string, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await updateVendor(vendor.id, form);
            router.refresh();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar alterações.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            await deleteVendor(vendor.id);
            router.push('/fornecedores');
        } catch (err: any) {
            setError(err.message || 'Erro ao excluir fornecedor.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-ivory rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                {/* Header */}
                <div className="sticky top-0 bg-ivory/95 backdrop-blur-sm z-10 px-6 pt-6 pb-4 border-b border-stone-200/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-serif font-semibold text-text-primary">Editar Fornecedor</h2>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors text-text-secondary"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 py-5 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium text-warm-gray uppercase tracking-wider mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-4 py-3 bg-cream border-2 border-transparent focus:border-gold rounded-xl text-text-primary font-medium focus:outline-none transition-colors"
                            disabled={isSaving}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-medium text-warm-gray uppercase tracking-wider mb-2">
                            Categoria
                        </label>
                        <select
                            value={form.serviceType}
                            onChange={(e) => handleChange('serviceType', e.target.value)}
                            className="w-full px-4 py-3 bg-cream border-2 border-transparent focus:border-gold rounded-xl text-text-primary font-medium focus:outline-none transition-colors appearance-none"
                            disabled={isSaving}
                        >
                            {categoryOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Estimated Value */}
                    <div>
                        <label className="block text-xs font-medium text-warm-gray uppercase tracking-wider mb-2">
                            Valor Estimado
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-dark/60 font-light text-lg">R$</span>
                            <input
                                type="number"
                                value={form.estimatedValue || ''}
                                onChange={(e) => handleChange('estimatedValue', Number(e.target.value))}
                                className="w-full pl-12 pr-4 py-3 bg-cream border-2 border-transparent focus:border-gold rounded-xl text-text-primary font-semibold text-lg focus:outline-none transition-colors"
                                placeholder="0,00"
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    {/* Stage */}
                    <div>
                        <label className="block text-xs font-medium text-warm-gray uppercase tracking-wider mb-2">
                            Estágio / Status
                        </label>
                        <select
                            value={form.stage}
                            onChange={(e) => handleChange('stage', e.target.value)}
                            className="w-full px-4 py-3 bg-cream border-2 border-transparent focus:border-gold rounded-xl text-text-primary font-medium focus:outline-none transition-colors appearance-none"
                            disabled={isSaving}
                        >
                            {stageOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-warm-gray uppercase tracking-wider mb-2">
                            Observações
                        </label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-cream border-2 border-transparent focus:border-gold rounded-xl text-text-primary font-medium focus:outline-none transition-colors resize-none"
                            placeholder="Anotações sobre este fornecedor..."
                            disabled={isSaving}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-ivory/95 backdrop-blur-sm px-6 py-5 border-t border-stone-200/50 space-y-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !form.name}
                        className="w-full bg-gold-primary hover:bg-gold-hover text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-gold-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Salvando...
                            </>
                        ) : 'Salvar Alterações'}
                    </button>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isSaving}
                        className="w-full py-3 text-red-500 hover:text-red-600 hover:bg-red-50 font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Excluir Fornecedor
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Popup */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center space-y-4">
                        <div className="w-14 h-14 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary">Excluir fornecedor?</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Tem certeza que deseja excluir <strong>{vendor.name}</strong>? Todas as propostas e análises associadas serão perdidas. Esta ação não pode ser desfeita.
                        </p>

                        {error && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-text-primary font-medium rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Excluindo...
                                    </>
                                ) : 'Excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
