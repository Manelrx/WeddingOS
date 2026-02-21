import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export function AttentionCard() {
    return (
        <Card className="p-5 bg-amber-50/50 border-amber-100 flex gap-4 items-start">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
                <p className="text-amber-900 font-medium">
                    Alguns pontos ainda precisam de confirmação
                </p>
                <p className="text-amber-700/80 text-sm">
                    Algumas propostas ainda não mencionam custos importantes. Vale revisar
                    com calma.
                </p>
            </div>
        </Card>
    );
}
