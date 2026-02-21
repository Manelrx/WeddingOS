import { Card } from "@/components/ui/card";

export function OverviewCard() {
    return (
        <Card className="p-6 bg-stone-50 border-stone-100">
            <p className="text-stone-600 text-lg font-medium leading-relaxed">
                Vocês já começaram a organizar os fornecedores principais. O resto é
                evolução, não urgência.
            </p>
        </Card>
    );
}
