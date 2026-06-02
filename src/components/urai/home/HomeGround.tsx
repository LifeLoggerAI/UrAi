"use client";

import React from "react";
import type { HomeWorldMode } from "./homeWorldState";

export default function HomeGround({
  mode,
  reducedMotion,
  onBloom,
}: {
  mode: HomeWorldMode;
  reducedMotion: boolean;
  onBloom: () => void;
}) {
  const bloom = mode === "speaking" || mode === "memory-ready";

  return (
    <button
      type="button"
      onClick={onBloom}
      aria-label="Activate recovery ground"
      className="absolute inset-x-0 bottom-0 z-[5] h-[48%] overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-emerald-100/30"
    >
      <div className="absolute inset-x-[-12%] bottom-[-34%] h-[90%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,.32),rgba(22,101,52,.28)_35%,rgba(15,23,42,.92)_62%,rgba(2,6,23,1)_81%)]" />
      <div className="absolute left-1/2 bottom-[19%] h-[1px] w-[78rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-100/25 to-transparent" />
      <div className={`${reducedMotion ? "" : "animate-[uraiGroundBloom_7s_ease-in-out_infinite]"} absolute left-1/2 bottom-[10%] h-48 w-[64rem] -translate-x-1/2 rounded-[50%] blur-2xl ${bloom ? "bg-emerald-200/36" : "bg-cyan-200/14"}`} />
      <div className="absolute left-1/2 bottom-[3%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(186,230,253,.14),transparent_66%)]" />
      <div className="absolute left-1/2 bottom-[25%] h-40 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,.13),transparent_70%)]" />
    </button>
  );
}
