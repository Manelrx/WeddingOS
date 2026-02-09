'use client';

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { createSupplierAction } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SupplierSchema } from "@/schemas";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FormSchema = SupplierSchema.pick({ name: true, serviceType: true });
type FormData = z.infer<typeof FormSchema>;

export default function NewSupplierPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(FormSchema)
    });

    const onSubmit = async (data: FormData) => {
        setError(null);
        const result = await createSupplierAction(data);
        if (result.success) {
            router.push('/');
            router.refresh();
        } else {
            setError(result.error || "Erro desconhecido");
        }
    };

    return (
        <main>
            <Header />
            <div className="container" style={{ padding: '1.5rem 1rem' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1rem', textDecoration: 'none' }}>
                    <ChevronLeft size={16} /> Voltar
                </Link>
                <h1 className="title">Novo Fornecedor</h1>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="name" className="label">Nome da Empresa / Fornecedor</label>
                        <input
                            {...register('name')}
                            id="name"
                            className="input"
                            placeholder="Ex: Buffet Fasano"
                        />
                        {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.name.message}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="serviceType" className="label">Tipo de Serviço</label>
                        <select
                            {...register('serviceType')}
                            id="serviceType"
                            className="input"
                        >
                            <option value="">Selecione...</option>
                            <option value="Buffet">Buffet</option>
                            <option value="Espaço">Espaço</option>
                            <option value="Fotografia">Fotografia</option>
                            <option value="Decoração">Decoração</option>
                            <option value="Bandas/DJ">Bandas/DJ</option>
                            <option value="Assessoria">Assessoria</option>
                            <option value="Outro">Outro</option>
                        </select>
                        {errors.serviceType && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.serviceType.message}</span>}
                    </div>

                    {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '4px' }}>{error}</div>}

                    <Button type="submit" className="mt-4" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Fornecedor'}
                    </Button>
                </form>
            </div>
        </main>
    );
}
