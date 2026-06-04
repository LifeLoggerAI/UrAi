"use client";

import { useState } from "react";

export function DemoAdminPanel() {
  const [shadowMode, setShadowMode] = useState("closed");
  const [sampleExport, setSampleExport] = useState(false);
  const [badgeEnabled, setBadgeEnabled] = useState(true);
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-lg font-semibold text-white">Demo Controls</h2>
      <p className="mt-2 text-sm text-slate-400">Demo routes remain sample-only and never connect to a private account.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="rounded-xl bg-slate-900 p-4 text-sm text-slate-300">Demo profile<select className="mt-2 w-full rounded-xl bg-slate-950 px-3 py-2 text-white"><option>Public demo</option><option>Founder demo</option><option>Investor demo</option></select></label>
        <label className="rounded-xl bg-slate-900 p-4 text-sm text-slate-300">Sample data set<select className="mt-2 w-full rounded-xl bg-slate-950 px-3 py-2 text-white"><option>Genesis sample world</option></select></label>
        <label className="rounded-xl bg-slate-900 p-4 text-sm text-slate-300">Shadow demo mode<select value={shadowMode} onChange={(event) => setShadowMode(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950 px-3 py-2 text-white"><option value="closed">Closed</option><option value="education">Education only</option></select></label>
        <label className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-sm text-slate-300">Sample export enabled<input type="checkbox" checked={sampleExport} onChange={(event) => setSampleExport(event.target.checked)} /></label>
        <label className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-sm text-slate-300">Demo badge enabled<input type="checkbox" checked={badgeEnabled} onChange={(event) => setBadgeEnabled(event.target.checked)} /></label>
      </div>
    </section>
  );
}
