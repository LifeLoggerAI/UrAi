"use client";

import type { MemoryStar } from "@/lib/life-map/types";
import { canonSafeSubtitle, canonSafeTitle } from "@/lib/life-map/production-copy";

interface ReplayThreadViewProps {
  visible: boolean;
  selectedStar?: MemoryStar;
  stars: MemoryStar[];
  onExit: () => void;
  onFocus: (star: MemoryStar) => void;
  reducedMotion?: boolean;
}

export default function ReplayThreadView({ visible, selectedStar, stars, onExit, onFocus, reducedMotion = false }: ReplayThreadViewProps) {
  if (!visible) return null;
  const beats = selectedStar ? [selectedStar, ...stars.filter((star) => star.constellationId === selectedStar.constellationId && star.id !== selectedStar.id).slice(0, 4)] : stars.slice(0, 5);

  return (
    <section className="pointer-events-auto fixed inset-x-[clamp(20px,5vw,80px)] top-[clamp(6.5rem,15vh,9rem)] z-40 mx-auto max-w-5xl rounded-[2rem] border border-cyan-100/18 bg-slate-950/78 p-5 text-cyan-50 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl max-sm:inset-x-3 max-sm:top-24" aria-label="Memory Replay">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-100/50">Replay thread</p>
          <h2 className="mt-1 text-3xl font-semibold leading-tight tracking-tight max-sm:text-2xl">Memory Replay</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-100/68">URAI is following this thread through time, keeping private signals softened.</p>
        </div>
        <button onClick={onExit} className="min-h-11 rounded-full border border-cyan-100/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-cyan-50 transition hover:bg-cyan-100/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70 active:scale-[0.97]">Exit replay</button>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-cyan-100/10" aria-hidden>
        <div className={`h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-100/40 via-cyan-100 to-violet-200/70 ${reducedMotion ? "" : "animate-[replayFilament_3.6s_ease-in-out_infinite]"}`} />
      </div>

      <div className="mt-6 grid gap-3">
        {beats.map((star, index) => {
          const active = star.id === selectedStar?.id || index === 0;
          return (
            <button
              key={star.id}
              onClick={() => onFocus(star)}
              className={`group flex min-h-[4.8rem] items-center gap-4 rounded-3xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70 ${active ? "border-cyan-100/34 bg-cyan-100/10 shadow-[0_0_34px_rgba(191,233,255,0.16)]" : "border-cyan-100/10 bg-white/[0.035] opacity-75 hover:opacity-100"}`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cyan-100/20 bg-slate-950/70 text-xs text-cyan-50 shadow-[0_0_24px_rgba(191,233,255,0.16)]">{index + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-cyan-50">{canonSafeTitle(star.title)}</span>
                <span className="mt-1 block text-xs text-cyan-100/58">{canonSafeSubtitle(star.subtitle)}</span>
              </span>
              <span className="hidden rounded-full border border-cyan-100/15 px-3 py-1 text-[11px] text-cyan-100/62 sm:inline">{active ? "Drifting" : "Memory beat"}</span>
            </button>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes replayFilament {
          0%, 100% { transform: translateX(-8%); opacity: .72; }
          50% { transform: translateX(42%); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
