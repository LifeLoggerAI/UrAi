"use client";

import type { UraiLaunchStatus } from "@/lib/admin/adminTypes";
import { useUraiAuth } from "@/providers/UraiAuthProvider";
import { useUraiFeatureFlags } from "@/providers/UraiFeatureFlagProvider";

const STATUSES: UraiLaunchStatus[] = ["private_alpha", "public_demo", "waitlist", "beta", "launched", "maintenance"];

export function LaunchStatusPanel() {
  const auth = useUraiAuth();
  const flags = useUraiFeatureFlags();
  const userId = auth.userId ?? auth.profile?.userId ?? "admin-ui";
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-lg font-semibold text-white">Launch</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="rounded-xl bg-slate-900 p-4 text-sm text-slate-300">Launch status<select value={flags.launchStatus} onChange={(event) => void flags.setLaunchStatus(event.target.value as UraiLaunchStatus, userId)} className="mt-2 w-full rounded-xl bg-slate-950 px-3 py-2 text-white">{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label className="rounded-xl bg-slate-900 p-4 text-sm text-slate-300">Launch message<textarea value={flags.launchMessage} onChange={(event) => void flags.setLaunchMessage(event.target.value, userId)} className="mt-2 h-24 w-full rounded-xl bg-slate-950 px-3 py-2 text-white" /></label>
      </div>
      <p className="mt-3 text-sm text-slate-400">Maintenance and public route behavior must still be enforced in user-facing surfaces.</p>
    </section>
  );
}
