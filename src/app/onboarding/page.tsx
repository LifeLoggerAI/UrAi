import type { Metadata } from "next";
import GenesisOnboardingFilm from "@/components/genesis/GenesisOnboardingFilm";

export const metadata: Metadata = {
  title: "URAI Genesis Onboarding Film | URAI",
  description:
    "Watch the launch-safe URAI Genesis onboarding film: a symbolic, consent-based preview of Home, Life Map, Focus, Replay, Orb, Passport, data ownership, accessibility, and legacy.",
};

export default function OnboardingPage() {
  return <GenesisOnboardingFilm />;
}
