"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function NarratorError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="narrator"
      error={error}
      reset={reset}
      title="Narrators are warming up"
      description="The roster of narrators didn't load. Try again or open your journal while we re-sync the voices."
      secondaryAction={{ label: "View journal", href: "/journal" }}
    />
  );
}
