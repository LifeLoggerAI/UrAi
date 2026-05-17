"use client";

import type { ReactNode } from "react";
import type { MemoryStar } from "@/lib/life-map/types";
import { formatMemoryConfidence } from "@/lib/life-map/formatters";
import CanonButton from "./CanonButton";

interface CanonOverlayPanelProps {
  kind: "privacy" | "ritual" | "mirror" | "error" | "empty" | "loading";
  memory?: MemoryStar;
  title?: string;
  body?: ReactNode;
  onClose?: () => void;
  onPrimary?: () => void;
}

const copy = {
  privacy: {
    eyebrow: "Privacy-safe explanation",
    title: "Why this appeared",
    body: "URAI can explain the pattern without exposing the private source. The visible star is a symbolic summary, not a raw transcript or diagnosis.",
    primary: "Return to memory",
  },
  ritual: {
    eyebrow: "Ritual anchor",
    title: "Let this memory settle",
    body: "Take one slow breath. Let the star dim, then brighten. URAI will keep the memory as a soft marker rather than a demand for action.",
    primary: "Complete ritual",
  },
  mirror: {
    eyebrow: "Mirror of Becoming",
    title: "Reflect without judgment",
    body: "This signal is being reflected as identity context. The mirror shows pattern, not verdict.",
    primary: "Return to galaxy",
  },
  error: {
    eyebrow: "Memory unavailable",
    title: "This memory could not be rendered.",
    body: "Return to the galaxy or try again when the signal is available.",
    primary: "Return to galaxy",
  },
  empty: {
    eyebrow: "Quiet sky",
    title: "Your sky is quiet.",
    body: "URAI will begin placing memory stars as passive signals gather.",
    primary: "Return home",
  },
  loading: {
    eyebrow: "Arranging sky",
    title: "URAI is arranging your memory sky...",
    body: "Memory stars, threads, and reflections are being prepared softly.",
    primary: "Stay here",
  },
};

export default function CanonOverlayPanel({ kind, memory, title, body, onClose, onPrimary }: CanonOverlayPanelProps) {
  const panel = copy[kind];
  return (
    <div className="pointer-events-auto fixed inset-0 z-50 grid place-items-center bg-slate-950/62 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={title ?? panel.title}>
      <section className="relative w-[min(520px,100%)] overflow-hidden rounded-[2rem] border border-cyan-100/18 bg-slate-950/86 p-6 text-cyan-50 shadow-[0_0_80px_rgba(14,165,233,.20)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_12%,rgba(125,211,252,.14),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(196,181,253,.12),transparent_32%)]" />
        <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-cyan-100/52">{panel.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em]">{title ?? panel.title}</h2>
        <div className="mt-4 text-sm leading-6 text-cyan-50/74">{body ?? panel.body}</div>
        {memory && (
          <div className="mt-5 rounded-2xl border border-cyan-100/12 bg-white/[.04] p-4">
            <p className="text-xs uppercase tracking-[.2em] text-cyan-100/42">Selected memory</p>
            <p className="mt-1 font-medium">{memory.title}</p>
            <p className="text-xs text-cyan-100/58">{formatMemoryConfidence(memory)}</p>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {onClose && <CanonButton variant="ghost" onClick={onClose}>Close</CanonButton>}
          <CanonButton variant="primary" onClick={onPrimary ?? onClose}>{panel.primary}</CanonButton>
        </div>
      </section>
    </div>
  );
}
