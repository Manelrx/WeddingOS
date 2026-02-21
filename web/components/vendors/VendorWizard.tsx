"use client";

import { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StepSupplierType from "./steps/StepSupplierType";
import StepBasicInfo from "./steps/StepBasicInfo";
import StepBudget from "./steps/StepBudget";
import StepConfirmation from "./steps/StepConfirmation";
import { useRouter } from "next/navigation";
import { createVendor, uploadProposal } from "@/lib/api/vendors.api";

const WEDDING_ID = "857cfa73-9305-4b00-84e2-7746eed73ab8";

export default function VendorWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState({
        type: "",
        name: "",
        observation: "",
        value: "",
        proposalFile: null as File | null,
    });

    const updateData = (newData: Partial<typeof data>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handleClose = () => {
        router.push("/fornecedores");
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Create the Vendor
            const vendor = await createVendor(WEDDING_ID, {
                name: data.name,
                serviceType: data.type,
            });

            // 2. If a proposal file was attached, upload it (triggers AI pipeline)
            if (data.proposalFile) {
                await uploadProposal(vendor.id, data.proposalFile);
            }

            // 3. Go to success screen
            nextStep();
        } catch (err: any) {
            console.error("Submission failed:", err);
            setError(err.message || "Erro ao salvar fornecedor. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <StepSupplierType
                        selectedType={data.type}
                        onSelect={(type) => {
                            updateData({ type });
                        }}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <StepBasicInfo
                        data={data}
                        updateData={updateData}
                        onPrev={prevStep}
                        onNext={nextStep}
                    />
                );
            case 3:
                return (
                    <StepBudget
                        data={data}
                        updateData={updateData}
                        onPrev={prevStep}
                        onNext={handleSubmit}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                );
            case 4:
                return (
                    <StepConfirmation
                        data={data}
                        onClose={handleClose}
                        onAddAnother={() => {
                            setData({ type: "", name: "", observation: "", value: "", proposalFile: null });
                            setStep(1);
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-ivory text-warm-gray font-display antialiased h-[100dvh] w-full flex justify-center selection:bg-champagne/30 overflow-hidden">
            <div className="w-full max-w-md bg-ivory h-full flex flex-col relative shadow-2xl overflow-hidden border-x border-warm-gray/5">
                {/* Header */}
                <header className="px-6 pt-8 pb-2 flex items-center justify-between z-10">
                    <button
                        onClick={step === 1 ? handleClose : prevStep}
                        className="text-warm-gray-light hover:text-gold-primary transition-colors p-2 -ml-2 rounded-full hover:bg-warm-gray/5"
                    >
                        {step === 1 ? <span className="material-icons-outlined text-2xl">close</span> : <span className="material-icons-outlined text-2xl">chevron_left</span>}
                    </button>

                    {step < 4 && (
                        <div className="flex items-center gap-2 flex-1 justify-center max-w-[160px]">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step
                                        ? "bg-gold-primary"
                                        : "bg-neutral-surface border border-neutral-200"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                    <div className="w-8"></div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col relative w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
