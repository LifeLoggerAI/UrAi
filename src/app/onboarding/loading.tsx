"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function OnboardingLoading() {
  useRouteLoadTelemetry("onboarding");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-black text-white">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-10 w-36 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        <div className="mx-auto h-4 w-64 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
      </div>
      <div className="h-12 w-40 rounded-full bg-white/20 animate-pulse" aria-hidden="true" />
      <span className="sr-only">Preparing onboarding</span>
    </div>
  );
}
