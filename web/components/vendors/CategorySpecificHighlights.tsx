
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { getHighlightsForCategory } from "@/lib/insights/vendorInsightMap";

interface CategorySpecificHighlightsProps {
    category: string;
}

export function CategorySpecificHighlights({ category }: CategorySpecificHighlightsProps) {
    const highlights = getHighlightsForCategory(category);

    if (!highlights || highlights.length === 0) return null;

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-serif text-stone-800">
                        O que avaliar em {category}?
                    </h3>
                    <p className="text-sm text-stone-500">
                        Pontos essenciais para comparar propostas desta categoria
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
                        <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 shrink-0" />
                        <span className="text-stone-700 text-sm">{highlight}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
