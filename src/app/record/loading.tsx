"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function RecordLoading() {
  useRouteLoadTelemetry("record");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-white">
      <div className="h-8 w-56 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
      <div className="h-12 w-48 rounded-full bg-white/20 animate-pulse" aria-hidden="true" />
      <div className="h-24 w-72 rounded-3xl border border-white/15 bg-white/5 animate-pulse" aria-hidden="true" />
      <span className="sr-only">Preparing recorder</span>
    </div>
  );
}
