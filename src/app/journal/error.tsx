"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function JournalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="journal"
      error={error}
      reset={reset}
      title="Journal is unavailable"
      description="We couldn’t pull in your latest entries. Try again or visit the support hub for updates."
      secondaryAction={{ label: "Visit support", href: "/support" }}
    />
  );
}
