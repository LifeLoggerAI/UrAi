"use client";

import type { MemoryStar } from "@/lib/life-map/types";
import { canonSafeSubtitle, canonSafeTitle, formatMemoryMeta, formatMemoryType } from "@/lib/life-map/production-copy";

interface FocusMemoryViewProps {
  memory?: MemoryStar;
  visible: boolean;
  onReplay: () => void;
  onWhyThis: () => void;
  onRitual: () => void;
  onPrivacy: () => void;
  onReturn: () => void;
  reducedMotion?: boolean;
}

const fallbackColor = "#bfe9ff";

export default function FocusMemoryView({ memory, visible, onReplay, onWhyThis, onRitual, onPrivacy, onReturn, reducedMotion = false }: FocusMemoryViewProps) {
  if (!visible || !memory) return null;

  const color = memory.color || fallbackColor;

  return (
    <section className="pointer-events-none fixed inset-0 z-40" aria-label="Focused memory">
      <div className="absolute inset-0 bg-slate-950/18 backdrop-blur-[1px]" aria-hidden />
      <article
        className={`pointer-events-auto absolute left-[clamp(20px,4vw,56px)] top-[clamp(6rem,14vh,9rem)] w-[min(520px,calc(100vw-(clamp(20px,4vw,56px)*2)))] overflow-hidden rounded-[2rem] border border-cyan-100/20 bg-slate-950/78 p-7 text-cyan-50 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl max-sm:top-24 max-sm:p-5 ${reducedMotion ? "" : "animate-[memoryFocusIn_700ms_cubic-bezier(0.16,1,0.3,1)_both]"}`}
        style={{
          background: `radial-gradient(circle at 18% 18%, ${color}33, transparent 34%), linear-gradient(135deg, rgba(10,16,34,.84), rgba(14,20,44,.58))`,
        }}
      >
        <div
          className="mb-5 h-[clamp(7rem,13vw,11.5rem)] w-[clamp(7rem,13vw,11.5rem)] rounded-full border border-white/20"
          style={{
            background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.92), ${color} 34%, rgba(3,7,18,.82) 78%)`,
            boxShadow: `0 0 48px ${color}88, 0 0 120px ${color}33`,
          }}
          aria-hidden
        />
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/56">{formatMemoryType(memory.type)}</p>
        <h2 className="m-0 text-[clamp(1.55rem,3vw,2.45rem)] font-semibold leading-none tracking-tight text-cyan-50">{canonSafeTitle(memory.title)}</h2>
        <p className="mt-2 text-sm font-medium text-cyan-100/72">{canonSafeSubtitle(memory.subtitle)}</p>
        <p className="mt-4 text-sm leading-6 text-cyan-50/82">{memory.narratorText || "This memory carried weight, so URAI rendered it softly."}</p>
        <p className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/[0.045] px-3 py-2 text-xs text-cyan-100/62">{formatMemoryMeta(memory)}</p>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Focused memory actions">
          <button onClick={onReplay} className="min-h-11 rounded-full border border-cyan-100/55 bg-cyan-100 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_26px_rgba(191,233,255,0.35)] transition hover:scale-[1.025] focus:outline-none focus:ring-2 focus:ring-cyan-100 active:scale-[0.97]">Replay thread</button>
          <button onClick={onWhyThis} className="min-h-11 rounded-full border border-cyan-100/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-cyan-50 transition hover:scale-[1.025] hover:bg-cyan-100/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70 active:scale-[0.97]">Why this?</button>
          <button onClick={onRitual} className="min-h-11 rounded-full border border-cyan-100/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-cyan-50 transition hover:scale-[1.025] hover:bg-cyan-100/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70 active:scale-[0.97]">Ritual</button>
          <button onClick={onPrivacy} className="min-h-11 rounded-full border border-cyan-100/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-cyan-50 transition hover:scale-[1.025] hover:bg-cyan-100/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70 active:scale-[0.97]">Privacy</button>
          <button onClick={onReturn} className="min-h-11 rounded-full border border-cyan-100/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-cyan-50 transition hover:scale-[1.025] hover:bg-cyan-100/10 focus:outline-none focus:ring-2 focus:ring-cyan-100/70 active:scale-[0.97]">Return</button>
        </div>
      </article>
      <style jsx global>{`
        @keyframes memoryFocusIn {
          from { opacity: 0; transform: translate3d(-18px, 14px, 0) scale(.96); filter: blur(10px); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
        }
      `}</style>
    </section>
  );
}
