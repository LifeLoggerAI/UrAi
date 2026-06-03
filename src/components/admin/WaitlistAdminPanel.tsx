"use client";

import { useMemo, useState } from "react";

type WaitlistRow = { email: string; name?: string | null; interestType?: string | null; source?: string | null; createdAt?: string | null };

const SAMPLE_ROWS: WaitlistRow[] = [];

function toCsv(rows: WaitlistRow[]): string {
  const header = ["email", "name", "interestType", "source", "createdAt"];
  return [header.join(","), ...rows.map((row) => header.map((key) => JSON.stringify((row as Record<string, unknown>)[key] ?? "")).join(","))].join("\n");
}

export function WaitlistAdminPanel() {
  const [rows] = useState<WaitlistRow[]>(SAMPLE_ROWS);
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => filter === "all" ? rows : rows.filter((row) => row.interestType === filter), [filter, rows]);
  const interests = Array.from(new Set(rows.map((row) => row.interestType).filter(Boolean))) as string[];

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `urai-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-white">Waitlist</h2><button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black" onClick={exportCsv}>Export CSV locally</button></div>
      <p className="mt-2 text-sm text-slate-400">Admin-only viewer. No bulk sending tools are included.</p>
      <select value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-4 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white"><option value="all">All interests</option>{interests.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-900 text-slate-400"><tr><th className="p-3">Email</th><th className="p-3">Name</th><th className="p-3">Interest</th><th className="p-3">Source</th><th className="p-3">Created</th></tr></thead><tbody>{filtered.length ? filtered.map((row) => <tr key={`${row.email}-${row.createdAt}`} className="border-t border-slate-800"><td className="p-3 text-white"><button onClick={() => void navigator.clipboard?.writeText(row.email)}>{row.email}</button></td><td className="p-3 text-slate-300">{row.name ?? ""}</td><td className="p-3 text-slate-300">{row.interestType ?? ""}</td><td className="p-3 text-slate-300">{row.source ?? ""}</td><td className="p-3 text-slate-300">{row.createdAt ?? ""}</td></tr>) : <tr><td className="p-4 text-slate-500" colSpan={5}>No waitlist rows loaded in this local admin view.</td></tr>}</tbody></table></div>
    </section>
  );
}
