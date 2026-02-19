import { ComparisonMatrix } from "@/app/types/comparison";
import { Card } from "@/components/ui/Card";
import { Check, X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

interface LupaViewProps {
    data: ComparisonMatrix;
}

export function LupaView({ data }: LupaViewProps) {
    // Group criteria by category
    const categories = Array.from(new Set(data.criteria.map(c => c.category)));

    return (
        <div className="space-y-4 pb-20">
            <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex gap-3">
                <SparklesIcon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-medium text-purple-900 text-sm">Raio-X Completo</h4>
                    <p className="text-purple-700 text-xs mt-1">Toque nas categorias para expandir os detalhes.</p>
                </div>
            </div>

            {categories.map((category) => (
                <CategoryGroup
                    key={category}
                    category={category}
                    data={data}
                />
            ))}
        </div>
    );
}

function CategoryGroup({ category, data }: { category: string, data: ComparisonMatrix }) {
    const [isOpen, setIsOpen] = useState(false);
    const criteria = data.criteria.filter(c => c.category === category);

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <span className="font-semibold text-slate-800">{category}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-6">
                            {criteria.map(criterion => (
                                <div key={criterion.key}>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        {criterion.label}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {data.proposals.map(proposal => {
                                            const item = proposal.items[criterion.key];
                                            return (
                                                <div key={proposal.proposalId} className="flex items-start bg-slate-50 p-2 rounded-lg">
                                                    <div className="w-24 shrink-0 font-medium text-xs text-slate-500 pt-0.5">
                                                        {proposal.vendorName}
                                                    </div>
                                                    <div className="grow pl-2 text-sm">
                                                        {item?.status === 'included' && (
                                                            <span className="text-slate-800">{item.originalName || 'Incluso'}</span>
                                                        )}
                                                        {item?.status === 'not_included' && (
                                                            <span className="text-rose-500 flex items-center"><X className="w-3 h-3 mr-1" /> Não incluso</span>
                                                        )}
                                                        {item?.status === 'not_informed' && (
                                                            <span className="text-amber-500 flex items-center"><HelpCircle className="w-3 h-3 mr-1" /> Não informado</span>
                                                        )}
                                                        {item?.notes && <p className="text-xs text-slate-400 mt-1 italic">{item.notes}</p>}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function SparklesIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}
