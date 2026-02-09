import { Supplier } from '@/schemas';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export function SupplierCard({ supplier }: { supplier: Supplier }) {
    return (
        <Link href={`/suppliers/${supplier.id}`} style={{ textDecoration: 'none' }}>
            <Card className="hover:border-primary transition-colors" style={{ transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{supplier.name}</h3>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{supplier.serviceType}</p>
                    </div>
                    <Badge status={supplier.status}>{supplier.status}</Badge>
                </div>
            </Card>
        </Link>
    );
}
