"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function CognitiveMirrorLoading() {
  useRouteLoadTelemetry("cognitive-mirror");

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-8 w-56 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="h-5 w-40 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="h-64 w-full rounded-2xl bg-white/10 animate-pulse" aria-hidden="true" />
        </div>
      </div>
      <span className="sr-only">Loading cognitive mirror</span>
    </div>
  );
}
