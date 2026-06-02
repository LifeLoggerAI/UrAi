"use client";

import React from "react";
import type { HomeWorldMode } from "./homeWorldState";

export default function HomeAvatar({
  mode,
  pointer,
  reducedMotion,
}: {
  mode: HomeWorldMode;
  pointer: { x: number; y: number };
  reducedMotion: boolean;
}) {
  const transform = reducedMotion
    ? undefined
    : `translate3d(calc(-50% + ${pointer.x * 10}px), calc(-50% + ${pointer.y * 8}px), 0)`;

  const visible = mode === "listening" || mode === "speaking" || mode === "thinking" || mode === "threshold";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-[52%] z-[4] h-[44rem] w-[30rem] transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-82"}`}
      style={{ transform }}
    >
      <div className={`${reducedMotion ? "" : "animate-[uraiAvatarFloat_7s_ease-in-out_infinite]"} absolute left-1/2 top-[0] h-40 w-40 -translate-x-1/2 rounded-full border border-cyan-100/12 bg-[radial-gradient(circle_at_38%_28%,rgba(255,255,255,.52),rgba(125,211,252,.20)_38%,rgba(15,23,42,.06)_74%,transparent)] blur-[.4px]`} />
      <div className={`${reducedMotion ? "" : "animate-[uraiAvatarBreath_6s_ease-in-out_infinite]"} absolute left-1/2 top-[22%] h-[31rem] w-[18rem] -translate-x-1/2 rounded-[48%] border border-cyan-100/12 bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,.27),rgba(14,165,233,.13)_42%,rgba(2,6,23,.04)_70%,transparent)] blur-[.2px]`} />
      <div className="absolute left-1/2 top-[48%] h-80 w-[1px] -translate-x-1/2 bg-gradient-to-b from-cyan-100/25 to-transparent" />
      <div className="absolute left-1/2 top-[19%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-cyan-100/6" />
    </div>
  );
}
