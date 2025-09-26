"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function LifeMapLoading() {
  useRouteLoadTelemetry("life-map");

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-8 w-36 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-9 w-20 rounded-full border border-white/15 bg-white/5 animate-pulse" aria-hidden="true" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading life map</span>
    </div>
  );
}
