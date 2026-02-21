
export class BudgetSummaryDto {
    totalBudget: number;
    contractedTotal: number;
    availableAmount: number;

    vendorStatus: {
        contracted: number;
        negotiating: number;
        undefined: number;
    };

    nextPayments: {
        id: string;
        vendorName: string;
        vendorId: string;
        amount: number;
        dueDate: Date;
        status: string;
    }[];
}
