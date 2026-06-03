"use client";

import type { UraiRitual } from "@/lib/rituals/ritualTypes";

type RitualCardProps = {
  ritual: UraiRitual;
  onStart: (ritualId: string) => void;
  onSave: (ritualId: string) => void;
  onSkip: (ritualId: string) => void;
  onHide: (ritualId: string) => void;
};

const glyphByType: Record<UraiRitual["type"], string> = {
  grounding: "⌁",
  recovery: "✺",
  reflection: "◇",
  release: "○",
  threshold: "✦",
  legacy: "◆",
  shadow_softening: "◐",
  focus: "•",
  calm: "~",
  system: "·",
};

export function RitualCard({ ritual, onStart, onSave, onSkip, onHide }: RitualCardProps) {
  if (ritual.status === "hidden") return null;
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4 text-white shadow-2xl backdrop-blur-xl" aria-label={`Ritual ${ritual.title}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">{ritual.type.replace(/_/g, " ")} · {ritual.intensity}</p>
          <h3 className="mt-2 text-base font-medium text-white">{ritual.title}</h3>
          {ritual.subtitle ? <p className="mt-1 text-sm text-white/58">{ritual.subtitle}</p> : null}
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/76 shadow-[0_0_22px_rgba(255,255,255,0.12)]">{glyphByType[ritual.type]}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/68">{ritual.summary}</p>
      <ol className="mt-3 space-y-1 text-xs leading-5 text-white/52">
        {ritual.steps.slice(0, 2).map((step) => <li key={step.id}>• {step.text}</li>)}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => onStart(ritual.id)} className="rounded-full bg-amber-200/16 px-3 py-2 text-xs text-white/88">Start</button>
        <button type="button" onClick={() => onSave(ritual.id)} className="rounded-full bg-white/[0.08] px-3 py-2 text-xs text-white/68">Save</button>
        <button type="button" onClick={() => onSkip(ritual.id)} className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/58">Skip</button>
        <button type="button" onClick={() => onHide(ritual.id)} className="rounded-full bg-white/[0.05] px-3 py-2 text-xs text-white/50">Hide</button>
      </div>
    </article>
  );
}
