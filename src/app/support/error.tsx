"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function SupportError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="support"
      error={error}
      reset={reset}
      title="Support desk is busy"
      description="We couldn’t load the help guides. Try again or view the status feed for live updates."
      secondaryAction={{ label: "View status", href: "/status" }}
    />
  );
}
