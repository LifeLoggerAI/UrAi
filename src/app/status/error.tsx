"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function StatusError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="status"
      error={error}
      reset={reset}
      title="Status dashboard offline"
      description="We couldn't fetch the latest uptime signals. Try again or reach out if you're spotting something urgent."
      secondaryAction={{ label: "Message support", href: "/support" }}
    />
  );
}
