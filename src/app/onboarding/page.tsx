"use client";
import React from "react";
// Swap this import to your real wizard component:
import InvestorOnboardingWizard from "@/components/InvestorOnboardingWizard";

export default function OnboardingPage() {
  const handleOnboardingComplete = (data: any) => {
    console.log("Onboarding complete:", data);
  };

  return (
    <main className="min-h-screen p-6">
      <InvestorOnboardingWizard onComplete={handleOnboardingComplete} />
    </main>
  );
}