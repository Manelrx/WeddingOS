export interface DashboardData {
    greeting: {
        names: string[];
        daysRemaining: number;
        quote: {
            text: string;
            author: string;
        };
    };
    planning: {
        progress: number;
        pendingPayment: {
            daysLeft: number;
            vendorName: string;
        };
        guestList: {
            unconfirmedCount: number;
        };
    };
    financial: {
        totalBudget: number;
        availableBudget: number;
    };
    decisions: Array<{
        id: string;
        category: string;
        status: string;
        statusColor: 'yellow' | 'red' | 'gray';
    }>;
}

export const homeDashboardMock: DashboardData = {
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
        },
        guestList: {
            unconfirmedCount: 15,
        },
    },
    financial: {
        totalBudget: 50000,
        availableBudget: 18000,
    },
    decisions: [
        {
            id: '1',
            category: 'Buffet',
            status: '2 pontos divergentes',
            statusColor: 'red',
        },
        {
            id: '2',
            category: 'Decoração',
            status: 'Orçamento pendente',
            statusColor: 'yellow',
        },
        {
            id: '3',
            category: 'Fotografia',
            status: 'Aguardando retorno',
            statusColor: 'gray',
        },
    ],
};
