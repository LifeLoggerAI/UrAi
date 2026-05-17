"use client";

import type { QualityMode } from "@/lib/life-map/types";

const modes: QualityMode[] = ["low", "medium", "high", "cinematic"];

export default function QualitySettingsPanel({
  qualityMode,
  reducedMotion,
  highContrast,
  textOnlyFallback,
  emotionalSafetyMode,
  localOnlyMode,
  onQualityChange,
  onToggleReducedMotion,
  onToggleHighContrast,
  onToggleTextOnly,
  onToggleEmotionalSafety,
  onToggleLocalOnly,
}: {
  qualityMode: QualityMode;
  reducedMotion: boolean;
  highContrast: boolean;
  textOnlyFallback: boolean;
  emotionalSafetyMode: boolean;
  localOnlyMode: boolean;
  onQualityChange: (mode: QualityMode) => void;
  onToggleReducedMotion: () => void;
  onToggleHighContrast: () => void;
  onToggleTextOnly: () => void;
  onToggleEmotionalSafety: () => void;
  onToggleLocalOnly: () => void;
}) {
  return (
    <div className="pointer-events-auto fixed left-5 top-24 z-30 w-[min(320px,calc(100vw-2rem))] rounded-3xl border border-cyan-100/15 bg-slate-950/60 p-4 text-cyan-50 backdrop-blur-2xl max-md:static max-md:mx-3 max-md:mt-3 max-md:w-auto">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/50">Quality + safety</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {modes.map((mode) => (
          <button key={mode} onClick={() => onQualityChange(mode)} className={`rounded-2xl px-3 py-2 text-xs capitalize ${qualityMode === mode ? "bg-cyan-100 text-slate-950" : "bg-white/5 text-cyan-50/70 hover:bg-white/10"}`}>
            {mode}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-xs">
        <Toggle label="Reduced motion" active={reducedMotion} onClick={onToggleReducedMotion} />
        <Toggle label="Text-only fallback" active={textOnlyFallback} onClick={onToggleTextOnly} />
        <Toggle label="High contrast" active={highContrast} onClick={onToggleHighContrast} />
        <Toggle label="Emotional safety mode" active={emotionalSafetyMode} onClick={onToggleEmotionalSafety} />
        <Toggle label="Local-only mode" active={localOnlyMode} onClick={onToggleLocalOnly} />
      </div>
      <p className="mt-4 text-[11px] leading-5 text-cyan-100/45">Low uses a static background and fewer particles. Cinematic turns on maximum shimmer, depth, and nebula richness.</p>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-2xl bg-white/[0.04] px-3 py-2 hover:bg-white/10">
      <span>{label}</span>
      <span className={`h-4 w-8 rounded-full p-0.5 ${active ? "bg-cyan-100" : "bg-white/15"}`}>
        <span className={`block h-3 w-3 rounded-full bg-slate-950 transition ${active ? "translate-x-4" : "translate-x-0"}`} />
      </span>
    </button>
  );
}
