"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function CognitiveMirrorError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="cognitive-mirror"
      error={error}
      reset={reset}
      title="Cognitive mirror is foggy"
      description="We couldn’t project your reflection data. Try again or hop to the status page for more detail."
      secondaryAction={{ label: "View status", href: "/status" }}
    />
  );
}
