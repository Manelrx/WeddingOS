import { ComparisonMatrix, ComparedItem, ComparisonCriterion } from "@/app/types/comparison";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Copy, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CiladaViewProps {
    data: ComparisonMatrix;
}

export function CiladaView({ data }: CiladaViewProps) {
    // Logic: Identify "Risks" -> items not_informed or explicitly excluded but typically important
    const risks: { proposalId: string; vendorName: string; risks: { item: ComparedItem; criterion: ComparisonCriterion }[] }[] = [];

    data.proposals.forEach(proposal => {
        const proposalRisks: { item: ComparedItem; criterion: ComparisonCriterion }[] = [];

        data.criteria.forEach(criterion => {
            const item = proposal.items[criterion.key];
            // Define what constitutes a risk
            // 1. Not Informed (High risk of surprise cost)
            // 2. Not Included (Explicit extra cost)
            if (item) {
                if (item.status === 'not_informed') {
                    proposalRisks.push({ item, criterion });
                } else if (item.status === 'not_included') {
                    // Could filter only critical categories if metadata existed, for now treat as potential extra cost
                    proposalRisks.push({ item, criterion });
                }
            }
        });

        if (proposalRisks.length > 0) {
            risks.push({ proposalId: proposal.proposalId, vendorName: proposal.vendorName, risks: proposalRisks });
        }
    });

    const getWhatsappMessage = (vendorName: string, riskList: typeof risks[0]['risks']) => {
        const items = riskList.map(r => `- ${r.criterion.label}: ${r.item.status === 'not_informed' ? 'Está incluso?' : 'Qual o valor adicional?'}`).join('\n');
        return `Olá! Vi a proposta de vocês (${vendorName}) e fiquei com algumas dúvidas:\n\n${items}`;
    };

    return (
        <div className="space-y-6 pb-24">
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-medium text-amber-900 text-sm">Pontos de Atenção</h4>
                    <p className="text-amber-700 text-xs mt-1">Estes itens podem gerar custos extras ou não foram esclarecidos.</p>
                </div>
            </div>

            {risks.map((riskGroup) => (
                <div key={riskGroup.proposalId} className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-lg sticky top-[130px] bg-slate-50/95 backdrop-blur py-2 z-10 px-1 border-b border-slate-200">
                        {riskGroup.vendorName}
                    </h3>

                    <div className="grid gap-3">
                        {riskGroup.risks.map((risk, idx) => (
                            <Card key={idx} className="p-4 border-l-4 border-amber-400">
                                <h4 className="font-bold text-slate-700 text-sm mb-1">{risk.criterion.label}</h4>
                                <p className="text-sm text-slate-600 mb-2">
                                    {risk.item.status === 'not_informed'
                                        ? 'Não encontramos menção a este item na proposta.'
                                        : 'Explicitamente não incluso. Pergunte o valor.'
                                    }
                                </p>
                                <div className="bg-slate-100 p-2 rounded text-xs text-slate-500 font-mono">
                                    SUGESTÃO: Perguntar "{risk.item.status === 'not_informed' ? 'Está incluso?' : 'Qual o valor?'}"
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 mt-2"
                        onClick={() => {
                            navigator.clipboard.writeText(getWhatsappMessage(riskGroup.vendorName, riskGroup.risks));
                            alert("Perguntas copiadas!");
                        }}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Copiar perguntas para enviar ao fornecedor
                    </Button>
                </div>
            ))}

            {risks.length === 0 && (
                <div className="text-center py-10">
                    <div className="inline-flex bg-emerald-100 p-4 rounded-full mb-4">
                        <AlertTriangle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3>Nenhuma cilada detectada!</h3>
                    <p className="text-slate-500">As propostas parecem completas.</p>
                </div>
            )}
        </div>
    );
}
