"use client";

import { useUraiFeatureFlags } from "@/providers/UraiFeatureFlagProvider";

export function AdminDataToolsPanel() {
  const flags = useUraiFeatureFlags();
  const clearDemoCache = () => {
    if (typeof window === "undefined") return;
    Object.keys(window.localStorage).filter((key) => key.includes("demo")).forEach((key) => window.localStorage.removeItem(key));
  };
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-lg font-semibold text-white">Data Tools</h2>
      <p className="mt-2 text-sm text-slate-400">Safe local operations only. No private user inspection or bulk destructive tools.</p>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <button className="rounded-xl bg-slate-900 p-3 text-left text-sm text-slate-200" onClick={clearDemoCache}>Clear local demo cache</button>
        <button className="rounded-xl bg-slate-900 p-3 text-left text-sm text-slate-200" onClick={flags.resetLocalFlags}>Reset local admin UI state</button>
        <div className="rounded-xl bg-slate-900 p-3 text-sm text-slate-400">Seed demo data: uses bundled sample registry.</div>
        <div className="rounded-xl bg-slate-900 p-3 text-sm text-slate-400">App version: local build metadata not configured.</div>
      </div>
    </section>
  );
}
