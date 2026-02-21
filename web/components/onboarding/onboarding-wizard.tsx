'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { StepBasics } from './steps/step-basics';
import { StepBudget } from './steps/step-budget';
import { StepServices } from './steps/step-services';
import { setupWedding, SetupWeddingPayload } from '@/lib/api/weddings.api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TOTAL_STEPS = 3;

export function OnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const [formData, setFormData] = useState<SetupWeddingPayload>({
        coupleNames: '',
        eventDate: '',
        guestCount: undefined,
        totalBudget: 0,
        services: [],
    });

    const updateData = (fields: Partial<SetupWeddingPayload>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const handleNext = async () => {
        if (step < TOTAL_STEPS) {
            setStep(s => s + 1);
        } else {
            await submitData();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(s => s - 1);
        }
    };

    const submitData = async () => {
        setIsLoading(true);
        try {
            await setupWedding(formData);
            setCompleted(true);
            setTimeout(() => {
                router.push('/orcamento'); // redirect to dashboard using main finance route
            }, 2500);
        } catch (error) {
            console.error('Submission failed', error);
            toast.error("Ocorreu um erro ao configurar o seu casamento. Tente novamente.");
            setIsLoading(false);
        }
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in-up h-[50vh]">
                <div className="w-20 h-20 bg-ivory-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">✨</span>
                </div>
                <h2 className="text-3xl font-serif text-gray-900 leading-tight">
                    Tudo pronto!<br />
                    Criando o seu dashboard...
                </h2>
                <p className="text-taupe">
                    Seus fornecedores fantasmas estão sendo configurados para o planejamento inicial.
                </p>
                <div className="pt-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gold-400 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col min-h-[70vh]">

            {/* Progress Bar */}
            <div className="mb-12 w-full flex gap-2">
                {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${step > idx ? 'bg-gold-400' : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>

            {/* Step Content */}
            <div className="flex-1">
                {step === 1 && <StepBasics data={formData} updateData={updateData} />}
                {step === 2 && <StepBudget data={formData} updateData={updateData} />}
                {step === 3 && <StepServices data={formData} updateData={updateData} />}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 pb-10 border-t border-gray-100 mt-auto">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 1 || isLoading}
                    className="text-taupe hover:text-gray-900"
                >
                    Voltar
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={isLoading || (step === 1 && !formData.coupleNames)}
                    className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 h-auto"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        step === TOTAL_STEPS ? 'Finalizar setup' : 'Continuar'
                    )}
                </Button>
            </div>
        </div>
    );
}
