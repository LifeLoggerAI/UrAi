"use client";

import React from "react";
import type { HomeWorldMode } from "./homeWorldState";

const stars = [
  ["6%", "17%", "2px"], ["13%", "42%", "2px"], ["24%", "22%", "3px"],
  ["38%", "12%", "2px"], ["51%", "8%", "3px"], ["68%", "17%", "2px"],
  ["82%", "29%", "3px"], ["94%", "52%", "2px"], ["74%", "63%", "2px"],
  ["31%", "64%", "2px"], ["16%", "70%", "2px"],
];

export default function HomeSky({
  mode,
  pointer,
  reducedMotion,
  transitioning,
  enterGalaxy,
}: {
  mode: HomeWorldMode;
  pointer: { x: number; y: number };
  reducedMotion: boolean;
  transitioning: boolean;
  enterGalaxy: () => void;
}) {
  const transform = reducedMotion
    ? undefined
    : `translate3d(${pointer.x * -18}px, ${pointer.y * -10}px, 0) scale(${transitioning ? 1.2 : 1})`;

  const memoryActive = mode === "hover" || mode === "memory-ready" || transitioning;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <button
        type="button"
        onClick={enterGalaxy}
        aria-label="Enter Memory Galaxy through the sky"
        className="absolute inset-x-0 top-0 z-20 h-[46%] cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-100/50"
      />

      <div className="pointer-events-none absolute inset-[-5%] transition-transform duration-700" style={{ transform }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.30),transparent_16%),radial-gradient(circle_at_27%_31%,rgba(34,211,238,.30),transparent_30%),radial-gradient(circle_at_76%_30%,rgba(168,85,247,.26),transparent_32%),radial-gradient(circle_at_50%_74%,rgba(16,185,129,.22),transparent_34%),linear-gradient(180deg,#01030a_0%,#071827_48%,#04140f_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.82),transparent_23%,transparent_75%,rgba(0,0,0,.72)),linear-gradient(180deg,rgba(0,0,0,.25),transparent_47%,rgba(0,0,0,.78))]" />

        <div className={`${reducedMotion ? "" : "animate-[uraiAuroraWide_14s_ease-in-out_infinite]"} absolute left-1/2 top-[16%] h-44 w-[90rem] -translate-x-1/2 rounded-[50%] bg-cyan-100/12 blur-3xl`} />
        <div className={`${reducedMotion ? "" : "animate-[uraiAuroraLeft_12s_ease-in-out_infinite]"} absolute left-[9%] top-[22%] h-[28rem] w-[34rem] rotate-[-18deg] rounded-[50%] bg-emerald-300/10 blur-3xl`} />
        <div className={`${reducedMotion ? "" : "animate-[uraiAuroraRight_15s_ease-in-out_infinite_reverse]"} absolute right-[4%] top-[20%] h-[30rem] w-[36rem] rotate-[18deg] rounded-[50%] bg-violet-300/12 blur-3xl`} />

        <div className={`absolute left-1/2 top-[26%] h-[1px] w-[82rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/24 to-transparent transition-opacity ${memoryActive ? "opacity-100" : "opacity-45"}`} />
        <div className="absolute left-1/2 top-[35%] h-[1px] w-[70rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-100/14 to-transparent" />

        {stars.map(([left, top, size], index) => (
          <span
            key={index}
            className={`${reducedMotion ? "" : "animate-[uraiStar_4s_ease-in-out_infinite]"} absolute rounded-full bg-cyan-100/75 shadow-[0_0_20px_rgba(186,230,253,.9)]`}
            style={{ left, top, width: size, height: size, animationDelay: `${index * 0.19}s` }}
          />
        ))}
      </div>
    </div>
  );
}
