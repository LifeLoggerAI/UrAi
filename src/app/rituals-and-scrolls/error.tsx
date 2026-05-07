"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function RitualsAndScrollsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="rituals-and-scrolls"
      error={error}
      reset={reset}
      title="Rituals are delayed"
      description="The rituals & scrolls feed isn’t available right now. Try again or check the status board."
      secondaryAction={{ label: "Check status", href: "/status" }}
    />
  );
}
