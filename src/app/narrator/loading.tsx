"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function NarratorLoading() {
  useRouteLoadTelemetry("narrator");

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-8 w-40 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="h-5 w-48 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="space-y-3 pt-3">
            <div className="h-11 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
            <div className="h-11 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
            <div className="h-11 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading narrator options</span>
    </div>
  );
}
