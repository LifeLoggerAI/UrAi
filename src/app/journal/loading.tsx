"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function JournalLoading() {
  useRouteLoadTelemetry("journal");

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-8 w-32 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="h-4 w-40 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
              <div className="h-16 w-full rounded-2xl bg-white/10 animate-pulse" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading journal entries</span>
    </div>
  );
}
