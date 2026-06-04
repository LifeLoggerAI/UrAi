"use client";

import { useState } from "react";
import { AdminDataToolsPanel } from "./AdminDataToolsPanel";
import { AdminOverviewPanel } from "./AdminOverviewPanel";
import { DemoAdminPanel } from "./DemoAdminPanel";
import { FeatureFlagsPanel } from "./FeatureFlagsPanel";
import { LaunchStatusPanel } from "./LaunchStatusPanel";
import { SafetyAdminPanel } from "./SafetyAdminPanel";
import { SystemHealthPanel } from "./SystemHealthPanel";
import { WaitlistAdminPanel } from "./WaitlistAdminPanel";

type Section = "overview" | "launch" | "waitlist" | "demo" | "flags" | "safety" | "errors" | "data" | "system";
const SECTIONS: Section[] = ["overview", "launch", "waitlist", "demo", "flags", "safety", "errors", "data", "system"];

export function AdminShell() {
  const [section, setSection] = useState<Section>("overview");
  return (
    <main className="min-h-screen bg-slate-950 p-5 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Internal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">URAI Admin</h1>
          <p className="mt-2 text-sm text-slate-400">Founder-controlled launch operations. No private user content is shown.</p>
        </header>
        <nav className="mb-5 flex flex-wrap gap-2">
          {SECTIONS.map((item) => <button key={item} onClick={() => setSection(item)} className={`rounded-full px-4 py-2 text-sm ${section === item ? "bg-white text-black" : "bg-slate-900 text-slate-300"}`}>{item}</button>)}
        </nav>
        {section === "overview" ? <AdminOverviewPanel /> : null}
        {section === "launch" ? <LaunchStatusPanel /> : null}
        {section === "waitlist" ? <WaitlistAdminPanel /> : null}
        {section === "demo" ? <DemoAdminPanel /> : null}
        {section === "flags" ? <FeatureFlagsPanel /> : null}
        {section === "safety" ? <SafetyAdminPanel /> : null}
        {section === "errors" ? <SystemHealthPanel /> : null}
        {section === "data" ? <AdminDataToolsPanel /> : null}
        {section === "system" ? <SystemHealthPanel /> : null}
      </div>
    </main>
  );
}
