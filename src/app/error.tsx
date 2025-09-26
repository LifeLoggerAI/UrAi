"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="root"
      error={error}
      reset={reset}
      title="The stage lights flickered"
      description="The landing sequence stalled. Try again or head to support while we reset the scene."
      secondaryAction={{ label: "Visit support", href: "/support" }}
    />
  );
}
