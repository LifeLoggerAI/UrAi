"use client";

import type { MemoryStar } from "@/lib/life-map/types";
import { getNarratorLineForTags, narratorStateForStar, narratorStateLabels } from "@/lib/life-map/narrator-lines";

export default function CompanionNarratorPanel({ selectedStar, emotionalSafetyMode }: { selectedStar?: MemoryStar; emotionalSafetyMode: boolean }) {
  const state = narratorStateForStar(selectedStar);
  const line = emotionalSafetyMode ? "Safety mode is softening this memory. URAI will keep the details gentle." : getNarratorLineForTags(selectedStar);

  return (
    <aside className="pointer-events-auto fixed right-5 top-5 z-30 w-[min(360px,calc(100vw-2rem))] rounded-3xl border border-cyan-100/15 bg-slate-950/70 p-4 text-cyan-50 shadow-[0_0_55px_rgba(8,47,73,0.45)] backdrop-blur-2xl max-md:top-20 max-md:right-3 max-md:w-[calc(100vw-1.5rem)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-full border border-cyan-100/20 bg-cyan-100/10 shadow-[0_0_24px_rgba(191,233,255,0.24)]" aria-hidden>
          <span className="text-lg">✦</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/55">Companion</p>
          <h2 className="text-sm font-semibold">{narratorStateLabels[state]}</h2>
        </div>
      </div>
      <p className="text-sm leading-6 text-cyan-50/85">{line}</p>
      {selectedStar && (
        <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/[0.04] p-3">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/45">Selected star</p>
          <p className="mt-1 font-medium">{selectedStar.title}</p>
          <p className="text-xs text-cyan-100/55">{selectedStar.subtitle}</p>
        </div>
      )}
    </aside>
  );
}
