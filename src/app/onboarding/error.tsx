"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function OnboardingError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="onboarding"
      error={error}
      reset={reset}
      title="Onboarding paused"
      description="We couldn't start the onboarding flow. Try again or explore the home scene while we stabilize things."
      secondaryAction={{ label: "Go to home", href: "/home" }}
    />
  );
}
