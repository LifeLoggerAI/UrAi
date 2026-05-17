"use client";

import { useMemo } from "react";
import type { LifeMapFilter, LifeMapMode, MemoryStar, QualityMode } from "@/lib/life-map/types";
import { lifeMapMockData } from "@/lib/life-map/mock-data";

type CameraCommand = "idle" | "replay" | "mirror" | "recenter" | "focus";

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

function starPosition(index: number, count: number, radius: number) {
  const angle = (index / Math.max(1, count)) * Math.PI * 2 - Math.PI / 2;
  return {
    left: `${50 + Math.cos(angle) * radius}%`,
    top: `${50 + Math.sin(angle) * radius * 0.58}%`,
  };
}

export default function MemoryGalaxyCanvas(props: MemoryGalaxyCanvasProps) {
  const visibleStars = useMemo(() => {
    const allowed = filterToStarTypes[props.activeFilter] || [];
    return lifeMapMockData.memoryStars.filter((star) => {
      if (props.hiddenStarIds.includes(star.id)) return false;
      return allowed.length === 0 || allowed.includes(star.type) || star.emotionalTags.some((tag) => tag.toLowerCase().includes(props.activeFilter.toLowerCase()));
    });
  }, [props.activeFilter, props.hiddenStarIds]);

  useMemo(() => {
    if (props.cameraCommand !== "idle") props.onCameraCommandComplete();
  }, [props]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_48%_42%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_68%_22%,rgba(168,85,247,0.14),transparent_26%),linear-gradient(180deg,#020617,#030712_62%,#07111f)]">
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.7)_1px,transparent_1px),radial-gradient(circle_at_70%_35%,rgba(147,197,253,.7)_1px,transparent_1px),radial-gradient(circle_at_40%_80%,rgba(216,180,254,.7)_1px,transparent_1px)] [background-size:80px_80px,120px_120px,150px_150px]" />
      <div className="absolute left-1/2 top-1/2 h-[52vh] w-[78vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/15 shadow-[0_0_110px_rgba(34,211,238,.13)]" />
      <div className="absolute left-1/2 top-1/2 h-[34vh] w-[58vw] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] rounded-full border border-violet-200/10" />
      {visibleStars.map((star, index) => {
        const selected = star.id === props.selectedStarId;
        const blurred = props.blurredStarIds.includes(star.id);
        const position = starPosition(index, visibleStars.length, selected ? 22 : 36);
        return (
          <button
            key={star.id}
            type="button"
            onClick={() => props.onSelectStar(star)}
            onDoubleClick={() => props.onOpenStar(star)}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-300 ${selected ? "h-7 w-7 bg-cyan-100 shadow-[0_0_38px_rgba(165,243,252,.88)]" : "h-3 w-3 bg-cyan-200/80 shadow-[0_0_18px_rgba(125,211,252,.55)]"} ${blurred ? "blur-sm" : ""} ${props.highContrast ? "ring-2 ring-white" : ""}`}
            style={position}
            aria-label={`Open ${star.title}`}
          >
            <span className="sr-only">{star.title}</span>
          </button>
        );
      })}
      <div className="absolute bottom-5 left-5 rounded-2xl border border-cyan-100/15 bg-slate-950/60 px-4 py-3 text-xs text-cyan-50/70 backdrop-blur-xl">
        Lightweight cinematic galaxy · {props.mode} · {props.qualityMode}
      </div>
    </div>
  );
}
