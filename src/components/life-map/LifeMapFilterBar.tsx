"use client";

import type { LifeMapFilter } from "@/lib/life-map/types";

const filters: LifeMapFilter[] = ["All", "Becoming", "Threshold", "Recovery", "Relationships", "Dream Field", "Mirror", "Grief", "Joy", "Purpose", "Conflict", "Legacy", "Shadow", "Rebirth"];

export default function LifeMapFilterBar({ activeFilter, onChange }: { activeFilter: LifeMapFilter; onChange: (filter: LifeMapFilter) => void }) {
  return (
    <nav className="pointer-events-auto fixed bottom-3 left-1/2 z-30 flex w-[min(960px,calc(100vw-1.5rem))] -translate-x-1/2 gap-1 overflow-x-auto rounded-[1.75rem] border border-cyan-100/14 bg-slate-950/72 p-2 shadow-2xl backdrop-blur-2xl" aria-label="Memory Galaxy category rail">
      {filters.map((filter) => {
        const active = activeFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={active}
            className={`min-h-12 min-w-[108px] shrink-0 rounded-[1.25rem] px-3 py-2 text-left text-[11px] font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-200/60 ${active ? "border border-cyan-100/24 bg-white/[0.09] text-cyan-50 shadow-[0_0_28px_rgba(125,211,252,.14)]" : "border border-transparent text-cyan-50/66 hover:bg-cyan-100/8 hover:text-cyan-50"}`}
          >
            <span className="block leading-tight">{filter}</span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-[.16em] text-cyan-100/42">{active ? "active lens" : "memory lens"}</span>
          </button>
        );
      })}
    </nav>
  );
}
