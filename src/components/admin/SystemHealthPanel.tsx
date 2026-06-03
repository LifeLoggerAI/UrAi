"use client";

export function SystemHealthPanel() {
  const rows = [
    ["Firebase", "Local status only"],
    ["Auth", "Provider gated"],
    ["Firestore", "Admin route only"],
    ["AI", "Safe status route"],
    ["Storage", "Review later"],
    ["Waitlist", "Route configured"],
    ["Demo", "Route configured"],
    ["Assets", "Use QA checklist"],
    ["Audio", "Use QA checklist"],
  ];
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-lg font-semibold text-white">System</h2>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-900 p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-sm text-slate-200">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
