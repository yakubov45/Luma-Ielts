import { Suspense } from "react";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata = {
  title: "O‘quv Rejasi So‘rovnomasi | IELTS Focus",
  description: "IELTS maqsadlaringiz va kunlik o‘quv jadvalingizni belgilang.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen py-4 sm:py-8">
      <Suspense fallback={<div className="card p-12 text-center text-sm text-[var(--muted)]">So‘rovnoma yuklanmoqda…</div>}>
        <OnboardingWizard />
      </Suspense>
    </div>
  );
}
