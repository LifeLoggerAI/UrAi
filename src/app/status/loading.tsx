"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function StatusLoading() {
  useRouteLoadTelemetry("status");

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-4">
          <div className="h-3 w-32 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="h-8 w-72 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="h-4 w-full rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="h-4 w-3/4 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        </header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-28 rounded-3xl border border-white/10 bg-white/5 animate-pulse" aria-hidden="true" />
          ))}
        </section>
        <section className="h-48 rounded-3xl border border-white/10 bg-white/5 animate-pulse" aria-hidden="true" />
      </div>
      <span className="sr-only">Loading service status</span>
    </main>
  );
}
