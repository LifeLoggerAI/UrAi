"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function RootLoading() {
  useRouteLoadTelemetry("root");

  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-black animate-pulse" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center text-white/70">
        <div className="h-32 w-32 rounded-full bg-white/20 blur-xl" aria-hidden="true" />
        <div className="space-y-3">
          <div className="mx-auto h-3 w-48 rounded-full bg-white/20" aria-hidden="true" />
          <div className="mx-auto h-3 w-32 rounded-full bg-white/10" aria-hidden="true" />
        </div>
      </div>
      <span className="sr-only">Loading URAI</span>
    </div>
  );
}
