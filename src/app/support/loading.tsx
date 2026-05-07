"use client";

import { useRouteLoadTelemetry } from "@/lib/useRouteLoadTelemetry";

export default function SupportLoading() {
  useRouteLoadTelemetry("support");

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="space-y-4 text-center sm:text-left">
          <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="h-8 w-64 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="h-4 w-full rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
        </header>
        <section className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-48 rounded-3xl border border-white/10 bg-white/5 animate-pulse" aria-hidden="true" />
          ))}
        </section>
        <section className="h-40 rounded-3xl border border-white/10 bg-white/5 animate-pulse" aria-hidden="true" />
      </div>
      <span className="sr-only">Loading support content</span>
    </main>
  );
}
