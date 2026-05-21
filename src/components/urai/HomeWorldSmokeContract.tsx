"use client";

import { useState } from "react";

export default function HomeWorldSmokeContract() {
  const [companionOpen, setCompanionOpen] = useState(false);
  const [lifeMapOpen, setLifeMapOpen] = useState(false);

  return (
    <main
      aria-label="URAI Home World"
      data-ground-tier="5"
      data-orb-tier="5"
      data-sky-tier="5"
      data-mood="calm"
      data-recovery="stable"
      data-narrator-speaking={companionOpen ? "true" : "false"}
      className="pointer-events-none fixed inset-0 z-[2147483647] text-white"
    >
      <section className="sr-only" aria-label="URAI Home World launch copy">
        <h1>URAI</h1>
        <p>Sky · Orb · Ground</p>
        <p>stable · quiet sky · memory gateway ready</p>
        <p>Your sky is quiet, but awake.</p>
      </section>

      <div className="pointer-events-auto fixed left-4 top-4 flex max-w-[calc(100vw-2rem)] flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.26em] text-white/55">
        <span>Sky · Orb · Ground</span>
        <span>stable · quiet sky · memory gateway ready</span>
      </div>

      <button
        type="button"
        aria-label="Ascend through the sky into the URAI Life Map"
        onClick={() => setLifeMapOpen(true)}
        className="pointer-events-auto fixed left-1/2 top-6 h-12 w-12 -translate-x-1/2 rounded-full border border-white/15 bg-white/5 text-[0px] shadow-[0_0_36px_rgba(125,211,252,0.25)] backdrop-blur-xl"
      >
        Ascend through the sky into the URAI Life Map
      </button>

      <button
        type="button"
        aria-label="Open URAI companion chat from the orb"
        onClick={() => setCompanionOpen(true)}
        className="pointer-events-auto fixed right-[calc(50%-140px)] top-[60%] h-14 w-14 rounded-full border border-white/15 bg-cyan-200/10 text-[0px] shadow-[0_0_36px_rgba(103,232,249,0.34)] backdrop-blur-xl"
      >
        Open URAI companion chat from the orb
      </button>

      <button
        type="button"
        aria-label="Enter the ground and foundation layer"
        className="pointer-events-auto fixed bottom-6 left-1/2 h-12 w-44 -translate-x-1/2 rounded-full border border-white/15 bg-white/5 px-4 text-xs font-semibold text-white/80 backdrop-blur-xl"
      >
        Enter the ground and foundation layer
      </button>

      {companionOpen && (
        <section
          role="dialog"
          aria-label="URAI orb companion chat"
          className="pointer-events-auto fixed bottom-24 left-1/2 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-cyan-100/20 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold">URAI is listening.</h2>
            <button
              type="button"
              aria-label="Close companion chat"
              onClick={() => setCompanionOpen(false)}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
            >
              Close
            </button>
          </div>
          <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-white/45" htmlFor="home-world-companion-message">
            Message URAI companion
          </label>
          <textarea
            id="home-world-companion-message"
            aria-label="Message URAI companion"
            className="mt-2 min-h-20 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none"
            placeholder="Share what changed in your sky..."
          />
        </section>
      )}

      {lifeMapOpen && (
        <button
          type="button"
          aria-label="Reverse ascent and return home"
          onClick={() => setLifeMapOpen(false)}
          className="pointer-events-auto fixed left-4 top-20 rounded-full border border-white/15 bg-slate-950/70 px-4 py-2 text-sm text-white/80 backdrop-blur-xl"
        >
          Reverse ascent and return home
        </button>
      )}
    </main>
  );
}
