"use client";

import type { KeyboardEvent } from "react";
import type { ShadowReflection, ShadowViewMode } from "@/lib/shadow/shadowTypes";

type ShadowReflectionCardProps = {
  reflection: ShadowReflection;
  viewMode: ShadowViewMode;
  isSelected?: boolean;
  onSelect: (reflectionId: string) => void;
};

const intensityLabel: Record<ShadowReflection["intensity"], string> = {
  soft: "soft",
  noticeable: "noticeable",
  heavy: "heavier",
  threshold: "threshold",
};

function safeTitle(reflection: ShadowReflection, mode: ShadowViewMode): string {
  if (reflection.visibility === "locked") return reflection.softenedTitle ?? "This layer is closed.";
  if (mode === "soft" || reflection.visibility === "softened") return reflection.softenedTitle ?? reflection.title;
  return reflection.title;
}

function safeSummary(reflection: ShadowReflection, mode: ShadowViewMode): string {
  if (reflection.visibility === "locked") return reflection.softenedSummary ?? "Open Passport if you choose.";
  if (mode === "soft" || reflection.visibility === "softened") return reflection.softenedSummary ?? reflection.summary;
  return reflection.summary;
}

export function ShadowReflectionCard({ reflection, viewMode, isSelected = false, onSelect }: ShadowReflectionCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(reflection.id);
    }
  };

  if (reflection.visibility === "hidden") return null;

  return (
    <button
      type="button"
      onClick={() => onSelect(reflection.id)}
      onKeyDown={handleKeyDown}
      className={`w-full rounded-3xl border p-4 text-left shadow-2xl backdrop-blur-xl transition ${isSelected ? "border-white/28 bg-white/13" : "border-white/10 bg-white/[0.06] hover:bg-white/[0.09]"}`}
      aria-label={`Open protected reflection ${safeTitle(reflection, viewMode)}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/10 px-2 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/52">{reflection.patternType.replace(/_/g, " ")}</span>
        <span className="rounded-full bg-indigo-100/10 px-2 py-1 text-[0.65rem] text-white/58">{intensityLabel[reflection.intensity]}</span>
      </div>
      <h3 className="mt-3 text-base font-medium text-white">{safeTitle(reflection, viewMode)}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/66">{safeSummary(reflection, viewMode)}</p>
      <p className="mt-3 text-[0.68rem] text-white/42">{reflection.confidence === "low" ? "early signal" : reflection.confidence === "medium" ? "forming pattern" : "clearer signal, not certainty"}</p>
    </button>
  );
}
