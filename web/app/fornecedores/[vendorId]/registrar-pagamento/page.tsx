
import { Container } from "@/components/layout/container";
import { getVendorFinancials } from "@/lib/api/financial.api";
import { getVendorById } from "@/lib/api/vendors.api";
import { PaymentForm } from "@/components/vendors/payment/payment-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

interface PageProps {
    params: Promise<{
        vendorId: string;
    }>;
}

export default async function RegisterPaymentPage({ params }: PageProps) {
    const { vendorId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('weddingos_token')?.value;

    if (!token) {
        redirect("/login");
    }

    const vendorData = getVendorById(vendorId, token);
    const financialData = getVendorFinancials(vendorId, token);

    const [vendor, financial] = await Promise.all([vendorData, financialData]);

    if (!vendor) {
        notFound();
    }

    return (
        <Container className="pb-20 space-y-6 pt-6">
            <div className="flex items-center gap-2 mb-2">
                <Link href={`/fornecedores/${vendorId}/financeiro`} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Registrar Pagamento</h1>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Fornecedor</p>
                <p className="font-semibold text-gray-900">{vendor.name}</p>
            </div>

            <PaymentForm
                weddingId={vendor.weddingId}
                vendorId={vendorId}
                vendorName={vendor.name}
                installments={financial.installments}
            />
        </Container>
    );
}
