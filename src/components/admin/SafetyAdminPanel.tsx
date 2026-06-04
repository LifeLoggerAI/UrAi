"use client";

const ITEMS = [
  "Shadow default off",
  "Legacy default off",
  "Export default off",
  "Notifications default off",
  "Companion memory default off",
  "Cloud sync sensitive layers default off",
  "Push auto-request disabled",
  "Audio capture disabled unless explicit",
  "Demo sample-only mode",
];

export function SafetyAdminPanel() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-lg font-semibold text-white">Safety</h2>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {ITEMS.map((item) => <div key={item} className="rounded-xl bg-slate-900 p-3 text-sm text-slate-300">✓ {item}</div>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm"><a className="rounded-full bg-white/10 px-4 py-2 text-white" href="/docs/privacy/compliance-launch-checklist.md">Compliance checklist path</a><a className="rounded-full bg-white/10 px-4 py-2 text-white" href="/docs/launch/demo-qa-checklist.md">Demo QA path</a></div>
      <p className="mt-3 text-sm text-slate-400">This panel does not bypass Passport or user consent.</p>
    </section>
  );
}
