"use client";

import { useUraiFeatureFlags } from "@/providers/UraiFeatureFlagProvider";

export function AdminOverviewPanel() {
  const flags = useUraiFeatureFlags();
  const allFlags = Object.values(flags.flags);
  const enabledCount = allFlags.filter((flag) => flag.enabled).length;
  const safetyCriticalOn = allFlags.filter((flag) => flag.safetyCritical && flag.enabled).length;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-lg font-semibold text-white">Overview</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-slate-900 p-4"><p className="text-xs text-slate-400">Launch status</p><p className="mt-1 text-white">{flags.launchStatus}</p></div>
        <div className="rounded-xl bg-slate-900 p-4"><p className="text-xs text-slate-400">Flags enabled</p><p className="mt-1 text-white">{enabledCount}/{allFlags.length}</p></div>
        <div className="rounded-xl bg-slate-900 p-4"><p className="text-xs text-slate-400">Safety-critical on</p><p className="mt-1 text-white">{safetyCriticalOn}</p></div>
        <div className="rounded-xl bg-slate-900 p-4"><p className="text-xs text-slate-400">Waitlist</p><p className="mt-1 text-white">View only</p></div>
      </div>
      <p className="mt-4 text-sm text-slate-400">Firebase, AI, storage, build, and rules status are summarized in System Health. No private user content is shown here.</p>
    </section>
  );
}
