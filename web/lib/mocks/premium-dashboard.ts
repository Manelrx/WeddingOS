import { PremiumDashboardData } from '@/types/premium-dashboard';

export const premiumDashboardMock: PremiumDashboardData = {
    greeting: {
        names: ['Emanuel', 'Melissa'],
        daysRemaining: 152,
        quote: {
            text: "O amor não consiste em olhar um para o outro, mas sim em olhar juntos para a mesma direção.",
            author: "Antoine de Saint-Exupéry",
        },
    },
    planning: {
        progress: 35,
        pendingPayment: {
            daysLeft: 2,
            vendorName: "Buffet Imperial",
            amount: 4500.00,
        },
        guestList: {
            total: 150,
            confirmed: 85,
            pending: 15,
        },
    },
    financial: {
        totalBudget: 50000,
        spent: 32000,
        available: 18000,
    },
    decisions: [
        {
            id: '1',
            category: 'Buffet',
            title: 'Definir cardápio final',
            status: '2 pontos divergentes',
            priority: 'high',
        },
        {
            id: '2',
            category: 'Decoração',
            title: 'Aprovar orçamento floral',
            status: 'Pendente revisão',
            priority: 'medium',
        },
        {
            id: '3',
            category: 'Fotografia',
            title: 'Contrato enviado',
            status: 'Aguardando assinatura',
            priority: 'low',
        },
    ],
};
