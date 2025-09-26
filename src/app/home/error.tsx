"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function HomeError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="home"
      error={error}
      reset={reset}
      title="Home experience stalled"
      description="The home scene didn’t finish loading. Try again or jump to your life map while we reload the assets."
      secondaryAction={{ label: "Open life map", href: "/life-map" }}
    />
  );
}
