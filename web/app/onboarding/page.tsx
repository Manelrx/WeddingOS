import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
    return (
        <main className="min-h-screen bg-ivory-50 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-soft-gold p-8 sm:p-12 relative z-10">
                <OnboardingWizard />
            </div>
        </main>
    );
}
