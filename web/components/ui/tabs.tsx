import { motion } from 'framer-motion';

interface TabOption {
    id: string;
    label: string;
}

interface TabsProps {
    options: TabOption[];
    activeId: string;
    onChange: (id: string) => void;
}

export function Tabs({ options, activeId, onChange }: TabsProps) {
    return (
        <div className="flex bg-slate-100 p-1 rounded-xl relative">
            {options.map((option) => {
                const isActive = activeId === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={`flex-1 relative py-2 text-sm font-medium transition-colors z-10 ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-20">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
