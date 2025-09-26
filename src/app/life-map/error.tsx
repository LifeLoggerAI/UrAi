"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function LifeMapError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <RouteErrorFallback
      route="life-map"
      error={error}
      reset={reset}
      title="Life map is out of orbit"
      description="The map of your states didn’t render. Try again or drop into the home scene while we realign things."
      secondaryAction={{ label: "Return home", href: "/home" }}
    />
  );
}
