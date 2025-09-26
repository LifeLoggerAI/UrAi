"use client";

import Link from "next/link";
import { useEffect } from "react";
import RouteState from "@/components/feedback/RouteState";
import { recordRouteError, recordRouteReset } from "@/lib/telemetry/routeTelemetry";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    recordRouteError(error, "root");
  }, [error]);

  return (
    <RouteState
      variant="error"
      title="We lost the thread for a moment"
      description={
        <div className="space-y-3">
          <p>
            The page ran into something unexpected. We keep a lightweight console trail so you can share it with the
            team if the issue persists.
          </p>
          {error?.message && (
            <pre className="overflow-x-auto rounded-2xl bg-black/40 p-4 text-xs text-red-200">
              {error.message}
            </pre>
          )}
        </div>
      }
      primaryActionLabel="Try again"
      onPrimaryAction={() => {
        recordRouteReset("root");
        reset();
      }}
      secondaryAction={
        <Link
          href="/support"
          className={[
            "inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2",
            "text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:border-white/30 hover:text-white",
          ].join(" ")}
        >
          Contact support ↗
        </Link>
      }
    />
  );
}
