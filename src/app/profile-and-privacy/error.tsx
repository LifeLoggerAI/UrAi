"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function ProfileAndPrivacyError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="profile-and-privacy"
      error={error}
      reset={reset}
      title="Profile controls are offline"
      description="We couldn’t load your profile and privacy preferences. Try again or ping support if it keeps happening."
      secondaryAction={{ label: "Contact support", href: "/support" }}
    />
  );
}
