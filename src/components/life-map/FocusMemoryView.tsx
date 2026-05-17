"use client";

import type { MemoryStar } from "@/lib/life-map/types";
import { formatMemoryConfidence, memoryTypeLabel } from "@/lib/life-map/formatters";
import CanonButton from "./CanonButton";

interface FocusMemoryViewProps {
  memory: MemoryStar;
  onReplay: () => void;
  onWhyThis: () => void;
  onRitual: () => void;
  onPrivacy: () => void;
  onReturn: () => void;
  reducedMotion?: boolean;
}

export default function FocusMemoryView({ memory, onReplay, onWhyThis, onRitual, onPrivacy, onReturn, reducedMotion = false }: FocusMemoryViewProps) {
  return (
    <section className="pointer-events-none fixed inset-0 z-30" aria-label={`${memory.title} focused memory`}>
      <div className="pointer-events-auto absolute left-[var(--urai-safe-x)] top-[clamp(6rem,14vh,9rem)] w-[min(520px,calc(100vw-48px))] overflow-hidden rounded-[2rem] border border-cyan-100/20 bg-slate-950/70 p-7 text-cyan-50 shadow-2xl backdrop-blur-2xl max-md:left-4 max-md:right-4 max-md:top-24 max-md:w-auto max-md:p-5">
        <div className="absolute inset-0 -z-10 bg-slate-950/50" />
        <div
          className={`mb-5 h-[clamp(7rem,13vw,11.5rem)] w-[clamp(7rem,13vw,11.5rem)] rounded-full ${reducedMotion ? "" : "animate-pulse"}`}
          style={{
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.88), ${memory.color} 36%, rgba(2,6,23,.92) 74%)`,
            boxShadow: `0 0 48px ${memory.color}88, 0 0 120px ${memory.color}28`,
          }}
          aria-hidden
        />
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100/55">{memory.type} - {memoryTypeLabel(memory)}</p>
        <h2 className="m-0 text-[clamp(1.55rem,3vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-cyan-50">{memory.title}</h2>
        <p className="mt-2 text-sm text-cyan-50/72">{memory.subtitle}</p>
        <p className="mt-4 text-sm leading-6 text-cyan-50/78">{memory.narratorText || "This was a crossing point, not a diagnosis."}</p>
        <p className="mt-4 text-xs text-cyan-100/55">{formatMemoryConfidence(memory)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <CanonButton variant="primary" onClick={onReplay} aria-label={`Replay ${memory.title} thread`}>Replay thread</CanonButton>
          <CanonButton variant="secondary" onClick={onWhyThis}>Why this?</CanonButton>
          <CanonButton variant="ghost" onClick={onRitual}>Ritual</CanonButton>
          <CanonButton variant="ghost" onClick={onPrivacy}>Privacy</CanonButton>
          <CanonButton variant="ghost" onClick={onReturn}>Return</CanonButton>
        </div>
      </div>
    </section>
  );
}
