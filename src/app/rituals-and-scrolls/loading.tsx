"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function RitualsAndScrollsLoading() {
  useRouteLoadTelemetry("rituals-and-scrolls");

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="h-8 w-52 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        <div className="space-y-3">
          <div className="h-4 w-64 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="h-4 w-56 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        </div>
      </div>
      <span className="sr-only">Loading rituals & scrolls</span>
    </div>
  );
}
