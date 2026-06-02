"use client";

import type { KeyboardEvent } from "react";
import type { LifeMapStar } from "@/lib/lifemap/lifeMapTypes";

type LifeMapStarNodeProps = {
  star: LifeMapStar;
  isSelected?: boolean;
  onSelect: (starId: string) => void;
};

const sizeByIntensity: Record<LifeMapStar["intensity"], number> = {
  quiet: 8,
  soft: 12,
  bright: 16,
  flare: 22,
  threshold: 26,
};

const classByType: Record<LifeMapStar["type"], string> = {
  memory: "bg-amber-200 shadow-amber-200/70",
  mood: "bg-blue-200 shadow-blue-200/70",
  relationship: "bg-violet-200 shadow-violet-200/70",
  ritual: "bg-emerald-200 shadow-emerald-200/70",
  milestone: "bg-yellow-100 shadow-yellow-100/80",
  recovery: "bg-teal-200 shadow-teal-200/70",
  shadow: "bg-indigo-300 shadow-indigo-300/60",
  legacy: "bg-orange-200 shadow-orange-200/70",
  passport: "bg-sky-200 shadow-sky-200/70",
  system: "bg-white shadow-white/70",
};

export function LifeMapStarNode({ star, isSelected = false, onSelect }: LifeMapStarNodeProps) {
  const size = sizeByIntensity[star.intensity];

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(star.id);
    }
  };

  return (
    <button
      type="button"
      aria-label={`Open ${star.title}`}
      onClick={() => onSelect(star.id)}
      onKeyDown={handleKeyDown}
      className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      style={{ left: `${star.x}%`, top: `${star.y}%`, width: size * 3, height: size * 3 }}
    >
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[10px] text-slate-950 shadow-[0_0_28px] transition-transform duration-300 group-hover:scale-110 ${classByType[star.type]}`}
        style={{ width: size, height: size, opacity: star.visibility === "requires_permission" ? 0.42 : 1 }}
      >
        {star.glyph}
      </span>
      {(isSelected || star.intensity === "flare" || star.intensity === "threshold") ? (
        <span className="absolute left-1/2 top-[calc(50%+18px)] min-w-28 -translate-x-1/2 rounded-full bg-black/35 px-2 py-1 text-[0.65rem] text-white/80 backdrop-blur-sm">
          {star.title}
        </span>
      ) : null}
    </button>
  );
}
