import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type ServiceStatus = "analysis" | "negotiating" | "hired" | "none";

interface ServiceCardProps {
    name: string;
    statusLabel: string;
    status: ServiceStatus;
    onClick?: () => void;
}

function ServiceCard({ name, statusLabel, status, onClick }: ServiceCardProps) {
    const getStatusColor = (s: ServiceStatus) => {
        switch (s) {
            case "hired":
                return "bg-emerald-400";
            case "negotiating":
                return "bg-amber-400";
            case "analysis":
                return "bg-blue-400";
            default:
                return "bg-stone-200";
        }
    };

    return (
        <Card
            onClick={onClick}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors active:scale-[0.99] border-stone-100 shadow-sm"
        >
            <div className="flex items-center gap-4">
                <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(status)} shadow-sm`}
                    aria-hidden="true"
                />
                <div>
                    <h3 className="text-stone-900 font-medium">{name}</h3>
                    <p className="text-stone-500 text-sm">{statusLabel}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
        </Card>
    );
}

export function ServiceList() {
    const router = useRouter();

    const services = [
        {
            id: "buffet",
            name: "Buffet & Gastronomia",
            statusLabel: "2 propostas analisadas",
            status: "analysis" as ServiceStatus,
        },
        {
            id: "foto",
            name: "Fotografia",
            statusLabel: "Em negociação",
            status: "negotiating" as ServiceStatus,
        },
        {
            id: "musica",
            name: "Música & DJ",
            statusLabel: "Não iniciado",
            status: "none" as ServiceStatus,
        },
        {
            id: "decoracao",
            name: "Decoração",
            statusLabel: "Contrato assinado",
            status: "hired" as ServiceStatus,
        },
    ];

    const handleServiceClick = (id: string) => {
        // Navigate to the comparison page for the selected service
        // For 'musica', standardizing to 'music' or keeping 'musica' depending on routes.
        // Assuming backend/routes use standard comparison/[id].
        router.push(`/comparison/${id}`);
    };

    return (
        <div className="flex flex-col gap-3">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    name={service.name}
                    statusLabel={service.statusLabel}
                    status={service.status}
                    onClick={() => handleServiceClick(service.id)}
                />
            ))}
        </div>
    );
}
