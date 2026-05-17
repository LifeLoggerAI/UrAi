"use client";

import type { LifeMapFilter } from "@/lib/life-map/types";

const filters: LifeMapFilter[] = ["All", "Becoming", "Threshold", "Recovery", "Relationships", "Dream Field", "Mirror", "Grief", "Joy", "Purpose", "Conflict", "Legacy", "Shadow", "Rebirth"];

export default function LifeMapFilterBar({ activeFilter, onChange }: { activeFilter: LifeMapFilter; onChange: (filter: LifeMapFilter) => void }) {
  return (
    <div className="pointer-events-auto fixed bottom-3 left-1/2 z-30 flex w-[94vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-full border border-cyan-100/10 bg-slate-950/75 px-3 py-2 backdrop-blur-2xl">
      {filters.map((filter) => (
        <button key={filter} onClick={() => onChange(filter)} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-200/50 ${activeFilter === filter ? "bg-cyan-100 text-slate-950 shadow-[0_0_18px_rgba(191,233,255,0.45)]" : "bg-white/5 text-cyan-50/75 hover:bg-cyan-100/10 hover:text-cyan-50"}`}>
          {filter}
        </button>
      ))}
    </div>
  );
}
