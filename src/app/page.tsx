import { Header } from '@/components/layout/Header';
import { SupplierCard } from '@/components/suppliers/SupplierCard';
import { Button } from '@/components/ui/Button';
import { supplierService } from '@/services/supplierService';
import Link from 'next/link';
import { Plus } from 'lucide-react';

// Force dynamic rendering since we are using in-memory mock data that changes
export const dynamic = 'force-dynamic';

export default async function Home() {
  const suppliers = await supplierService.getAll();

  return (
    <main>
      <Header />
      <div className="container" style={{ padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 className="title" style={{ marginBottom: 0 }}>Fornecedores</h1>
          <Link href="/suppliers/new">
            <Button size="sm">
              <Plus size={16} /> Novo
            </Button>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {suppliers.map(s => <SupplierCard key={s.id} supplier={s} />)}
          {suppliers.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>Nenhum fornecedor cadastrado.</p>
              <Link href="/suppliers/new">
                <Button variant="outline">Começar agora</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
