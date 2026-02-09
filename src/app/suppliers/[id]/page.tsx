import { Header } from '@/components/layout/Header';
import { supplierService } from '@/services/supplierService';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProposalManager } from '@/components/proposal/ProposalManager';
import { Badge } from '@/components/ui/Badge';

export default async function SupplierDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supplier = (await supplierService.getAll()).find(s => s.id === id);

    if (!supplier) notFound();

    return (
        <main>
            <Header />
            <div className="container" style={{ padding: '1.5rem 1rem' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1rem', textDecoration: 'none' }}>
                    <ChevronLeft size={16} /> Voltar
                </Link>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <h1 className="title" style={{ marginBottom: 0 }}>{supplier.name}</h1>
                        <Badge status={supplier.status}>{supplier.status}</Badge>
                    </div>
                    <p style={{ color: 'var(--muted-foreground)' }}>{supplier.serviceType}</p>
                </div>

                {supplier.id && <ProposalManager supplierId={supplier.id} />}
            </div>
        </main>
    );
}
