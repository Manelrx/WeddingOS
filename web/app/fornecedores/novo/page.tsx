import VendorWizard from "@/components/vendors/VendorWizard";

export const metadata = {
    title: "Adicionar Fornecedor | WeddingOS",
    description: "Wizard de criação de fornecedor para seu casamento.",
};

export default function NewVendorPage() {
    return (
        <div className="min-h-screen bg-[#F2F0EB]">
            <VendorWizard />
        </div>
    );
}
