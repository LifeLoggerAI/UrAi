"use client";

import type { KeyboardEvent } from "react";
import type { GroundElement } from "@/lib/ground/groundTypes";

type GroundElementNodeProps = {
  element: GroundElement;
  isSelected?: boolean;
  onSelect: (elementId: string) => void;
};

const classByType: Record<GroundElement["type"], string> = {
  root: "bg-amber-200 shadow-amber-200/70",
  sprout: "bg-emerald-200 shadow-emerald-200/70",
  bloom: "bg-pink-200 shadow-pink-200/70",
  stone: "bg-stone-200 shadow-stone-200/50",
  water: "bg-cyan-200 shadow-cyan-200/70",
  lantern: "bg-yellow-200 shadow-yellow-200/80",
  ritualSeed: "bg-lime-200 shadow-lime-200/70",
  recoveryBloom: "bg-teal-200 shadow-teal-200/80",
  habitPlant: "bg-green-200 shadow-green-200/70",
  shadowMoss: "bg-indigo-300 shadow-indigo-300/60",
  legacyTree: "bg-orange-200 shadow-orange-200/70",
  passportGate: "bg-sky-200 shadow-sky-200/70",
  system: "bg-white shadow-white/60",
};

const glyphByType: Record<GroundElement["type"], string> = {
  root: "⌁",
  sprout: "•",
  bloom: "✺",
  stone: "◆",
  water: "◌",
  lantern: "✦",
  ritualSeed: "✧",
  recoveryBloom: "✺",
  habitPlant: "♧",
  shadowMoss: "◐",
  legacyTree: "♢",
  passportGate: "◉",
  system: "·",
};

export function GroundElementNode({ element, isSelected = false, onSelect }: GroundElementNodeProps) {
  const scale = element.position.scale ?? 1;
  const size = Math.round(18 * scale);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(element.id);
    }
  };

  return (
    <button
      type="button"
      aria-label={`Open ${element.title}`}
      onClick={() => onSelect(element.id)}
      onKeyDown={handleKeyDown}
      className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      style={{ left: `${element.position.x}%`, top: `${element.position.y}%`, width: size * 3, height: size * 3 }}
    >
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] text-slate-950 shadow-[0_0_28px] transition-transform duration-300 group-hover:scale-110 ${classByType[element.type]}`}
        style={{ width: size, height: size, opacity: element.state === "requires_permission" || element.state === "hidden" ? 0.45 : 1 }}
      >
        {glyphByType[element.type]}
      </span>
      {isSelected ? (
        <span className="absolute left-1/2 top-[calc(50%+20px)] min-w-28 -translate-x-1/2 rounded-full bg-black/35 px-2 py-1 text-[0.65rem] text-white/80 backdrop-blur-sm">
          {element.title}
        </span>
      ) : null}
    </button>
  );
}
