
import { Container } from "@/components/layout/container";
import { PremiumHeader } from "@/components/home/premium-header";
import { PlanningStatus } from "@/components/home/planning-status";
import { FinancialSummary } from "@/components/home/financial-summary";
import { GuestSummary } from "@/components/home/guest-summary";
import { OpenDecisions } from "@/components/home/open-decisions";
import { DailyMood } from "@/components/home/daily-mood";
import { getDashboardSummary } from "@/lib/api/dashboard.api";
import { DashboardSummaryDTO } from "@/types/dashboard.types";
import { PremiumDashboardData } from "@/types/premium-dashboard";

// Demo ID obtained from database.
// In a real app, this would come from the user session or context.
const DEMO_WEDDING_ID = '857cfa73-9305-4b00-84e2-7746eed73ab8';

export default async function Home() {
  let summary: DashboardSummaryDTO;

  try {
    summary = await getDashboardSummary(DEMO_WEDDING_ID);
  } catch (error) {
    console.error("Failed to fetch dashboard summary:", error);
    return (
      <Container className="py-20 text-center">
        <h1 className="text-xl font-semibold text-red-600">Erro ao carregar o dashboard</h1>
        <p className="text-gray-500">Não foi possível conectar ao servidor.</p>
      </Container>
    );
  }

  // Transform Backend DTO to Frontend UI Model
  const weddingDate = summary.weddingDate ? new Date(summary.weddingDate) : new Date();
  const today = new Date();
  const diffTime = weddingDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const data: PremiumDashboardData = {
    greeting: {
      names: summary.coupleNames.split(' & '), // Assumes names are joined by ' & '
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      quote: {
        text: "O amor é composto de uma única alma habitando dois corpos.",
        author: "Aristóteles"
      }
    },
    planning: {
      progress: 0, // Not yet implemented in backend
      guestList: {
        total: 0, // Not yet implemented in backend
        confirmed: 0,
        pending: 0
      },
      // pendingPayment is undefined if no payment is due
    },
    financial: {
      totalBudget: summary.totalBudget,
      spent: summary.totalCommitted,
      available: (summary.totalBudget || 0) - (summary.totalCommitted || 0),
    },
    decisions: summary.openDecisions.map(d => ({
      id: d.id,
      category: d.title, // Mapping serviceType to category
      title: d.description, // Mapping vendorName to title
      status: d.status,
      priority: 'medium' // Default priority
    }))
  };

  return (
    <Container className="pb-16 space-y-10">
      <PremiumHeader data={data.greeting} />

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <PlanningStatus data={data.planning} />
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <FinancialSummary data={data.financial} />
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <GuestSummary data={data.planning.guestList} />
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
        {data.decisions.length > 0 ? (
          <OpenDecisions data={data.decisions} />
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Nenhuma decisão pendente no momento.
          </div>
        )}
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <DailyMood data={data.greeting.quote} />
      </section>
    </Container>
  );
}
