"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function FocusError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="focus"
      error={error}
      reset={reset}
      title="Focus chamber needs a reset"
      description="The focus shell did not render cleanly. Try again, or return to Life Map."
      secondaryAction={{ label: "Return to Life Map", href: "/life-map" }}
    />
  );
}
