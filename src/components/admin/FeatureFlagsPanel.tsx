"use client";

import { useState } from "react";
import type { UraiFeatureFlagId } from "@/lib/admin/adminTypes";
import { useUraiAuth } from "@/providers/UraiAuthProvider";
import { useUraiFeatureFlags } from "@/providers/UraiFeatureFlagProvider";

export function FeatureFlagsPanel() {
  const auth = useUraiAuth();
  const flags = useUraiFeatureFlags();
  const [pending, setPending] = useState<UraiFeatureFlagId | null>(null);

  const toggle = async (id: UraiFeatureFlagId, enabled: boolean) => {
    const flag = flags.flags[id];
    if (flag.safetyCritical && !pending) {
      setPending(id);
      return;
    }
    await flags.setFlagEnabled(id, enabled, auth.userId ?? auth.profile?.userId ?? "admin-ui");
    setPending(null);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-lg font-semibold text-white">Feature Flags</h2>
      <div className="mt-4 grid gap-3">
        {Object.values(flags.flags).map((flag) => (
          <div key={flag.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-white">{flag.label} {flag.safetyCritical ? <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-200">safety-critical</span> : null}</p>
                <p className="mt-1 text-sm text-slate-400">{flag.description}</p>
                <p className="mt-2 text-xs text-slate-500">Updated {flag.updatedAt}{flag.updatedBy ? ` by ${flag.updatedBy}` : ""}</p>
              </div>
              <button className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-slate-700" onClick={() => void toggle(flag.id, !flag.enabled)}>
                {flag.enabled ? "Disable" : "Enable"}
              </button>
            </div>
            {pending === flag.id ? (
              <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-100">
                <p>Confirm this change. Turning on {flag.label} does not bypass Passport or user consent.</p>
                <div className="mt-2 flex gap-2">
                  <button className="rounded-full bg-amber-200 px-3 py-1 text-xs font-medium text-black" onClick={() => void toggle(flag.id, !flag.enabled)}>Confirm</button>
                  <button className="rounded-full bg-white/10 px-3 py-1 text-xs" onClick={() => setPending(null)}>Cancel</button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
