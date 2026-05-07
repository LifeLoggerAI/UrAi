"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function HomeLoading() {
  useRouteLoadTelemetry("home");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-black px-6 py-10 text-white">
      <div className="flex w-full max-w-3xl items-center justify-between text-sm text-white/50">
        <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        <div className="h-9 w-32 rounded-full border border-white/20 bg-white/10 animate-pulse" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16">
        <div className="h-60 w-40 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        <div className="h-16 w-16 rounded-full bg-blue-400/60 blur-sm animate-pulse" aria-hidden="true" />
        <div className="h-12 w-48 rounded-full bg-white/20 animate-pulse" aria-hidden="true" />
      </div>
      <div className="flex gap-4 pb-6">
        <div className="h-9 w-20 rounded-full border border-white/20 bg-white/5 animate-pulse" aria-hidden="true" />
        <div className="h-9 w-20 rounded-full border border-white/20 bg-white/5 animate-pulse" aria-hidden="true" />
        <div className="h-9 w-24 rounded-full border border-white/20 bg-white/5 animate-pulse" aria-hidden="true" />
      </div>
      <span className="sr-only">Loading home experience</span>
    </div>
  );
}
