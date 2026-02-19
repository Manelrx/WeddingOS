import { ComparisonMatrix } from "@/app/types/comparison";
import { Card } from "@/components/ui/Card";
import { Check, X, HelpCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface TiraTeimaViewProps {
    data: ComparisonMatrix;
}

export function TiraTeimaView({ data }: TiraTeimaViewProps) {
    // Logic: Filter criteria where vendors differ
    const differingCriteria = data.criteria.filter((criterion) => {
        const values = data.proposals.map(p => {
            const item = p.items[criterion.key];
            // We consider it a difference if status is different OR if notes/originalName varies significantly
            // For MVP, strictly check status or presence
            return item ? item.status : 'missing';
        });
        const uniqueValues = new Set(values);
        return uniqueValues.size > 1;
    });

    if (differingCriteria.length === 0) {
        return (
            <div className="text-center py-10 px-6">
                <div className="inline-flex bg-emerald-100 p-4 rounded-full mb-4">
                    <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Tudo igual!</h3>
                <p className="text-slate-500 mt-2">
                    Neste itens, as propostas são idênticas. Use a <strong>Lupa</strong> para ver detalhes ou o <strong>Detector de Cilada</strong> para riscos.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-medium text-blue-900 text-sm">Foco nas diferenças</h4>
                    <p className="text-blue-700 text-xs mt-1">Exibindo apenas onde os fornecedores divergem.</p>
                </div>
            </div>

            {differingCriteria.map((criterion) => (
                <Card key={criterion.key} className="p-4 overflow-hidden">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 px-1 border-l-4 border-rose-400 pl-2 uppercase tracking-wide">
                        {criterion.label}
                    </h3>

                    <div className="space-y-3">
                        {data.proposals.map((proposal) => {
                            const item = proposal.items[criterion.key];
                            if (!item) return null;

                            return (
                                <div key={proposal.proposalId} className="flex justify-between items-start text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                    <span className="font-medium text-slate-900 w-1/3 truncate text-xs text-slate-500 uppercase mt-0.5">
                                        {proposal.vendorName}
                                    </span>

                                    <div className="w-2/3 pl-2 flex flex-col items-end text-right">
                                        {item.status === 'included' && (
                                            <div className="flex items-center text-emerald-600 font-medium">
                                                <span className="mr-2">{item.originalName || 'Incluso'}</span>
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                        {item.status === 'not_included' && (
                                            <div className="flex items-center text-rose-500 font-medium">
                                                <span className="mr-2">Não incluso</span>
                                                <X className="w-4 h-4" />
                                            </div>
                                        )}
                                        {item.status === 'not_informed' && (
                                            <div className="flex items-center text-amber-500 font-medium">
                                                <span className="mr-2">Não informado</span>
                                                <HelpCircle className="w-4 h-4" />
                                            </div>
                                        )}

                                        {item.notes && (
                                            <p className="text-xs text-slate-400 mt-1 italic max-w-full">
                                                "{item.notes}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            ))}
        </div>
    );
}
