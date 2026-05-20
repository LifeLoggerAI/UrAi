"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function ReplayError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="replay"
      error={error}
      reset={reset}
      title="Replay theater needs a reset"
      description="The replay shell did not render cleanly. Try again, or return to Focus."
      secondaryAction={{ label: "Return to Focus", href: "/focus" }}
    />
  );
}
