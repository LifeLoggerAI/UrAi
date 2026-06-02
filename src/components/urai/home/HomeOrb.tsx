"use client";

import React from "react";
import type { HomeWorldState } from "./homeWorldState";
import { glowForMood } from "./homeWorldState";

export default function HomeOrb({
  state,
  pointer,
  reducedMotion,
  onOpen,
}: {
  state: HomeWorldState;
  pointer: { x: number; y: number };
  reducedMotion: boolean;
  onOpen: () => void;
}) {
  const orbMove = reducedMotion
    ? undefined
    : `translate3d(${pointer.x * 18}px, ${pointer.y * 12}px, 0)`;

  const glow = glowForMood(state.mood);

  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-[57%] z-[8] h-[40rem] w-[min(40rem,94vw)] -translate-x-1/2 -translate-y-1/2" style={{ transform: orbMove }}>
        <div className={`${reducedMotion ? "" : "animate-[uraiOrbAura_5s_ease-in-out_infinite]"} absolute inset-0 rounded-full bg-cyan-200/12 blur-3xl`} />
        <div
          className="absolute left-1/2 top-1/2 h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/14 bg-[radial-gradient(circle_at_34%_27%,rgba(255,255,255,.99),rgba(186,230,253,.78)_12%,rgba(34,211,238,.44)_28%,rgba(8,47,73,.80)_52%,rgba(2,6,23,.99)_78%)]"
          style={{ boxShadow: `0 0 170px ${glow}` }}
        />
        <div className={`${reducedMotion ? "" : "animate-[uraiOrbit_15s_linear_infinite]"} absolute left-1/2 top-1/2 h-[25rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-100/18`} />
        <div className={`${reducedMotion ? "" : "animate-[uraiOrbit_20s_linear_infinite_reverse]"} absolute left-1/2 top-1/2 h-[17rem] w-[39rem] -translate-x-1/2 -translate-y-1/2 rotate-[-14deg] rounded-[50%] border border-white/18`} />
        <div className="absolute left-1/2 top-1/2 h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/45 bg-cyan-100/14 shadow-[0_0_92px_rgba(186,230,253,.55)] backdrop-blur-xl" />
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Talk to URAI"
        className="absolute left-1/2 top-[57%] z-[10] grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-black uppercase tracking-[0.28em] text-white focus:outline-none focus:ring-2 focus:ring-cyan-100/80"
      >
        {state.orbLabel}
      </button>
    </>
  );
}
