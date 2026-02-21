'use client';


interface StepBudgetProps {
    data: {
        totalBudget: number;
    };
    updateData: (fields: Partial<StepBudgetProps['data']>) => void;
}

export function StepBudget({ data, updateData }: StepBudgetProps) {
    // Format number to BRL currency string
    const displayValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(data.totalBudget);

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-numeric characters for parsing
        const unformatted = e.target.value.replace(/\D/g, '');
        const value = parseInt(unformatted) || 0;
        updateData({ totalBudget: value });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-2">
                <h2 className="text-3xl font-serif text-gray-900 leading-tight">
                    Qual é o teto máximo<br />
                    do orçamento?
                </h2>
                <p className="text-taupe">Ter um valor em mente ajuda a guiar escolhas e prioridades.</p>
            </div>

            <div className="pt-4">
                <div className="relative">
                    <input
                        id="budget"
                        type="text"
                        inputMode="numeric"
                        className="w-full text-center text-4xl font-bold font-serif text-gray-900 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-gold-400 transition-colors pb-4"
                        value={data.totalBudget === 0 ? '' : displayValue}
                        placeholder="R$ 0,00"
                        onChange={handleBudgetChange}
                        autoFocus
                    />
                </div>
                <div className="flex gap-2 justify-center mt-6 flex-wrap">
                    {[30000, 50000, 80000, 100000, 150000].map((preset) => (
                        <button
                            key={preset}
                            onClick={() => updateData({ totalBudget: preset })}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-gold-400 hover:text-gold-600 transition-colors"
                        >
                            {preset / 1000}k
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
