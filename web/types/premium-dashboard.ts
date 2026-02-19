export interface PremiumDashboardData {
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
        pendingPayment?: {
            daysLeft: number;
            vendorName: string;
            amount: number;
        };
        guestList: {
            total: number;
            confirmed: number;
            pending: number;
        };
    };
    financial: {
        totalBudget: number;
        spent: number;
        available: number;
    };
    decisions: Array<{
        id: string;
        category: string;
        title: string;
        status: string;
        priority: 'high' | 'medium' | 'low';
    }>;
}
