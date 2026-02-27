import { Container } from "@/components/layout/container";
import { getBudgetSummary } from "@/lib/api/budget.api";
import { getMyWedding } from "@/lib/api/weddings.api";
import { BudgetSummaryCards } from "@/components/budget/budget-summary-cards";
import { VendorStatus } from "@/components/budget/vendor-status";
import { NextPaymentsList } from "@/components/budget/next-payments-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function BudgetPage() {
    let summary: any;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('weddingos_token')?.value;

        if (!token) {
            redirect("/login");
        }

        const wedding = await getMyWedding(token);
        summary = await getBudgetSummary(wedding.id, token);
        summary.weddingId = wedding.id;
    } catch (error) {
        console.error("Failed to fetch budget summary:", error);
        return (
            <Container className="py-20 text-center">
                <h1 className="text-xl font-semibold text-red-600">Erro ao carregar o orçamento</h1>
                <p className="text-gray-500">Não foi possível conectar ao servidor.</p>
            </Container>
        );
    }

    return (
        <Container className="pb-20 space-y-8 pt-6">
            <div className="flex items-center gap-2 mb-2">
                <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Orçamento</h1>
            </div>

            <div className="space-y-1">
                <p className="text-sm text-gray-500">Gestão financeira do seu grande dia.</p>
            </div>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <BudgetSummaryCards data={summary} weddingId={summary.weddingId} />
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
                    <p className="font-medium">Status do Planejamento</p>
                    <p className="opacity-90 mt-1">Alguns serviços ainda não possuem valor definido. Isso pode afetar seu planejamento final.</p>
                </div>
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <VendorStatus data={summary.vendorStatus} />
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                <NextPaymentsList payments={summary.nextPayments} />
            </section>
        </Container>
    );
}
