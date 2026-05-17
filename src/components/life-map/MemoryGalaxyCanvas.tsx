"use client";

import { useEffect, useMemo } from "react";
import type { LifeMapFilter, LifeMapMode, MemoryStar, QualityMode } from "@/lib/life-map/types";
import { lifeMapMockData } from "@/lib/life-map/mock-data";

export type CameraCommand = "idle" | "replay" | "mirror" | "recenter" | "focus" | "home" | "ritual" | "privacy";

interface MemoryGalaxyCanvasProps {
  mode: LifeMapMode;
  qualityMode: QualityMode;
  activeFilter: LifeMapFilter;
  selectedStarId: string;
  reducedMotion: boolean;
  highContrast: boolean;
  hiddenStarIds: string[];
  blurredStarIds: string[];
  onSelectStar: (star: MemoryStar) => void;
  onOpenStar: (star: MemoryStar) => void;
  cameraCommand: CameraCommand;
  onCameraCommandComplete: () => void;
}

const filterToStarTypes: Partial<Record<LifeMapFilter, string[]>> = {
  Becoming: ["memory", "purpose", "companion"],
  Threshold: ["threshold"],
  Recovery: ["recovery", "ritual"],
  Relationships: ["relationship", "companion"],
  "Dream Field": ["dream"],
  Mirror: ["mirror"],
  Grief: ["grief"],
  Joy: ["joy"],
  Purpose: ["purpose"],
  Conflict: ["shadow", "memory"],
  Legacy: ["legacy"],
  Shadow: ["shadow"],
  Rebirth: ["rebirth"],
};

function starPosition(star: MemoryStar, index: number, count: number) {
  const normalizedX = 50 + star.position3D.x * 8.4;
  const normalizedY = 50 - star.position3D.y * 13.4 + star.position3D.z * 2.6;
  if (Number.isFinite(normalizedX) && Number.isFinite(normalizedY)) {
    return { left: `${Math.max(11, Math.min(89, normalizedX))}%`, top: `${Math.max(18, Math.min(78, normalizedY))}%` };
  }
  const angle = (index / Math.max(1, count)) * Math.PI * 2 - Math.PI / 2;
  return { left: `${50 + Math.cos(angle) * 34}%`, top: `${50 + Math.sin(angle) * 20}%` };
}

export default function MemoryGalaxyCanvas({
  mode,
  qualityMode,
  activeFilter,
  selectedStarId,
  reducedMotion,
  highContrast,
  hiddenStarIds,
  blurredStarIds,
  onSelectStar,
  onOpenStar,
  cameraCommand,
  onCameraCommandComplete,
}: MemoryGalaxyCanvasProps) {
  const visibleStars = useMemo(() => {
    const allowed = filterToStarTypes[activeFilter] || [];
    return lifeMapMockData.memoryStars.filter((star) => {
      if (hiddenStarIds.includes(star.id)) return false;
      return allowed.length === 0 || allowed.includes(star.type) || star.emotionalTags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase()));
    });
  }, [activeFilter, hiddenStarIds]);

  const selectedStar = visibleStars.find((star) => star.id === selectedStarId) ?? lifeMapMockData.memoryStars.find((star) => star.id === selectedStarId);

  useEffect(() => {
    if (cameraCommand === "idle") return;
    const delay = reducedMotion ? 80 : cameraCommand === "replay" ? 1100 : cameraCommand === "focus" ? 900 : 700;
    const timer = window.setTimeout(onCameraCommandComplete, delay);
    return () => window.clearTimeout(timer);
  }, [cameraCommand, onCameraCommandComplete, reducedMotion]);

  const stageTransform = reducedMotion
    ? "translate3d(0,0,0) scale(1)"
    : cameraCommand === "focus"
      ? "translate3d(0,-1.5%,0) scale(1.08) rotate(-1deg)"
      : cameraCommand === "replay"
        ? "translate3d(0,-3%,0) scale(1.12) rotate(-2deg)"
        : cameraCommand === "mirror"
          ? "translate3d(0,2%,0) scale(.98)"
          : "translate3d(0,0,0) scale(1)";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_48%_42%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_68%_22%,rgba(168,85,247,0.14),transparent_26%),linear-gradient(180deg,#020617,#030712_62%,#07111f)]" data-mode={mode} data-quality={qualityMode}>
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.7)_1px,transparent_1px),radial-gradient(circle_at_70%_35%,rgba(147,197,253,.7)_1px,transparent_1px),radial-gradient(circle_at_40%_80%,rgba(216,180,254,.7)_1px,transparent_1px)] [background-size:80px_80px,120px_120px,150px_150px] motion-safe:animate-[uraiStarDrift_24s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 h-[58vh] w-[84vw] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] rounded-full bg-cyan-400/5 blur-2xl" />
      <div className="absolute left-1/2 top-1/2 h-[52vh] w-[78vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/15 shadow-[0_0_110px_rgba(34,211,238,.13)]" />
      <div className="absolute left-1/2 top-1/2 h-[34vh] w-[58vw] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] rounded-full border border-violet-200/10" />

      <div className="absolute inset-0 transition-transform duration-[900ms] ease-out" style={{ transform: stageTransform }}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50" aria-hidden>
          {visibleStars.map((star, index) => {
            if (!star.constellationId) return null;
            const next = visibleStars.find((other) => other.id !== star.id && other.constellationId === star.constellationId);
            if (!next) return null;
            const from = starPosition(star, index, visibleStars.length);
            const to = starPosition(next, visibleStars.indexOf(next), visibleStars.length);
            const selected = selectedStar?.constellationId === star.constellationId;
            return <line key={`${star.id}-${next.id}`} x1={from.left} y1={from.top} x2={to.left} y2={to.top} stroke={selected ? star.color : "rgba(190,215,255,.32)"} strokeWidth={selected ? 1.2 : 0.7} strokeDasharray="4 8" />;
          })}
        </svg>

        {visibleStars.map((star, index) => {
          const selected = star.id === selectedStarId;
          const blurred = blurredStarIds.includes(star.id);
          const filtered = activeFilter !== "All" && !selected;
          const position = starPosition(star, index, visibleStars.length);
          return (
            <div key={star.id} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={position}>
              <button
                type="button"
                onClick={() => onSelectStar(star)}
                onDoubleClick={() => onOpenStar(star)}
                className={`group grid min-h-11 min-w-11 place-items-center rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-100/80 focus:ring-offset-2 focus:ring-offset-slate-950 ${selected ? "scale-110" : "motion-safe:hover:scale-110"} ${filtered ? "opacity-60" : "opacity-100"}`}
                aria-label={`Open memory star ${star.title}: ${star.subtitle}`}
              >
                <span
                  className={`block rounded-full transition duration-300 ${selected ? "h-7 w-7" : "h-3 w-3 group-hover:h-4 group-hover:w-4"} ${blurred ? "blur-sm" : ""} ${highContrast ? "ring-2 ring-white" : ""}`}
                  style={{ backgroundColor: star.color, boxShadow: selected ? `0 0 42px ${star.color}, 0 0 96px ${star.color}55` : `0 0 20px ${star.color}AA` }}
                  aria-hidden
                />
                <span className="sr-only">{star.title}</span>
              </button>
              {(selected || !filtered) && (
                <div className={`pointer-events-none absolute left-1/2 top-9 min-w-[10rem] -translate-x-1/2 rounded-full border px-3 py-1.5 text-center backdrop-blur-xl transition ${selected ? "border-cyan-100/25 bg-slate-950/58 opacity-100 shadow-[0_0_28px_rgba(191,233,255,.18)]" : "border-transparent bg-transparent opacity-45"}`}>
                  <p className="text-sm font-semibold leading-tight text-cyan-50">{star.title}</p>
                  <p className="text-[11px] leading-tight text-cyan-100/60">{star.subtitle}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
