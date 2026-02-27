
import { Container } from "@/components/layout/container";
import { getVendorFinancials } from "@/lib/api/financial.api";
import { getVendorById } from "@/lib/api/vendors.api";
import { FinancialProgress } from "@/components/vendors/financial/financial-progress";
import { InstallmentList } from "@/components/vendors/financial/installment-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
<<<<<<< HEAD
import { cookies } from "next/headers";
=======
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208

interface PageProps {
    params: Promise<{
        vendorId: string;
    }>;
}

export default async function VendorFinancialPage({ params }: PageProps) {
    const { vendorId } = await params;

<<<<<<< HEAD
    const cookieStore = await cookies();
    const token = cookieStore.get('weddingos_token')?.value;

    // Parallel data fetching
    const vendorData = getVendorById(vendorId, token);
    const financialData = getVendorFinancials(vendorId, token);
=======
    // Parallel data fetching
    const vendorData = getVendorById(vendorId);
    const financialData = getVendorFinancials(vendorId);
>>>>>>> 4bbbe46cb8db37f481a16d5b134bc4c1ae9e0208

    const [vendor, financial] = await Promise.all([vendorData, financialData]);

    if (!vendor) {
        notFound();
    }

    return (
        <Container className="pb-20 space-y-8 pt-6">
            <div className="flex items-center gap-2 mb-2">
                <Link href="/orcamento" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{vendor.name}</h1>
                    <span className="text-xs text-text-secondary">{vendor.category || 'Fornecedor'}</span>
                </div>
            </div>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <FinancialProgress data={financial} />
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <InstallmentList installments={financial.installments} vendorId={vendorId} />
            </section>
        </Container>
    );
}
