"use client";

import type { KeyboardEvent } from "react";
import type { MirrorReflection } from "@/lib/mirror/mirrorTypes";

type MirrorReflectionCardProps = {
  reflection: MirrorReflection;
  isSelected?: boolean;
  onSelect: (reflectionId: string) => void;
};

const confidenceLabel: Record<MirrorReflection["confidence"], string> = {
  low: "early signal",
  medium: "forming pattern",
  high: "clear pattern",
};

function labelPattern(value: string): string {
  return value.replace(/_/g, " ");
}

export function MirrorReflectionCard({ reflection, isSelected = false, onSelect }: MirrorReflectionCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(reflection.id);
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(reflection.id)}
      onKeyDown={handleKeyDown}
      className={`w-full rounded-3xl border p-4 text-left shadow-2xl backdrop-blur-xl transition ${isSelected ? "border-white/28 bg-white/14" : "border-white/10 bg-white/[0.07] hover:bg-white/[0.1]"}`}
      aria-label={`Open reflection ${reflection.title}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/10 px-2 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/52">{labelPattern(reflection.patternType)}</span>
        <span className="rounded-full bg-white/[0.08] px-2 py-1 text-[0.65rem] text-white/58">{confidenceLabel[reflection.confidence]}</span>
      </div>
      <h3 className="mt-3 text-base font-medium text-white">{reflection.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/68">{reflection.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {reflection.sourceLayerIds.slice(0, 3).map((layer) => <span key={layer} className="rounded-full bg-white/[0.06] px-2 py-1 text-[0.65rem] text-white/46">{layer}</span>)}
        {reflection.suggestedAction && reflection.suggestedAction !== "none" ? <span className="rounded-full bg-sky-200/10 px-2 py-1 text-[0.65rem] text-white/60">next step</span> : null}
      </div>
    </button>
  );
}
