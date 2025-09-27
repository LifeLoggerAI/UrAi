"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function RecordError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="record"
      error={error}
      reset={reset}
      title="Recorder is muted"
      description="We couldn't start the recording studio. Try again or review support resources for troubleshooting."
      secondaryAction={{ label: "Support options", href: "/support" }}
    />
  );
}
