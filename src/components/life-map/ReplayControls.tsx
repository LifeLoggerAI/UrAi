"use client";

import type { MemoryStar } from "@/lib/life-map/types";
import CanonButton from "./CanonButton";

export default function ReplayControls({ isReplaying, selectedStar, onStop }: { isReplaying: boolean; selectedStar?: MemoryStar; onStop: () => void }) {
  if (!isReplaying) return null;
  const beats = [selectedStar?.subtitle || "Opening signal", "Context becomes a thread", "The thread settles back into your sky"];
  return (
    <section className="pointer-events-auto fixed left-1/2 top-[6.5rem] z-40 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 rounded-[2rem] border border-cyan-100/18 bg-slate-950/76 p-4 text-cyan-50 shadow-2xl backdrop-blur-2xl max-md:top-[8.6rem]" aria-label="Memory Replay">
      <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/52">Memory Replay</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">{selectedStar?.title ?? "Replay thread"}</h2>
          <p className="mt-1 text-xs text-cyan-100/58">Following the thread through time.</p>
        </div>
        <CanonButton variant="primary" onClick={onStop}>Exit replay</CanonButton>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-cyan-100/10" aria-hidden>
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-200/30 via-cyan-100 to-violet-200/70 shadow-[0_0_24px_rgba(191,233,255,.45)] motion-safe:animate-pulse" />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {beats.map((label, index) => (
          <div key={`${label}-${index}`} className={`rounded-2xl border border-cyan-100/10 bg-white/[0.04] p-3 text-xs text-cyan-50/72 ${index === 1 ? "shadow-lg" : "opacity-70"}`}>
            <span className="mb-2 block h-2 w-2 rounded-full bg-cyan-100" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
