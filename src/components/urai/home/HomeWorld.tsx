"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";
import HomeSky from "./HomeSky";
import HomeGround from "./HomeGround";
import HomeAvatar from "./HomeAvatar";
import HomeOrb from "./HomeOrb";
import { HOME_WORLD_STATES, type HomeWorldMode } from "./homeWorldState";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function vibrate(ms: number) {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
}

export default function HomeWorld(): React.ReactElement {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [orbOpen, setOrbOpen] = useState(false);
  const [mode, setMode] = useState<HomeWorldMode>("idle");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [transitioning, setTransitioning] = useState(false);
  const state = useMemo(() => HOME_WORLD_STATES[mode], [mode]);

  function enterGalaxy() {
    setMode("memory-ready");
    setTransitioning(true);
    vibrate(18);
    window.setTimeout(() => router.push("/life-map"), reducedMotion ? 80 : 700);
  }

  function openOrb() {
    setMode("listening");
    vibrate(12);
    setOrbOpen(true);
  }

  return (
    <>
      <main
        className="relative min-h-[100svh] overflow-hidden bg-[#01040a] text-white"
        onPointerMove={(event) => {
          if (reducedMotion) return;
          setPointer({
            x: event.clientX / window.innerWidth - 0.5,
            y: event.clientY / window.innerHeight - 0.5,
          });
        }}
        onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      >
        <HomeSky mode={mode} pointer={pointer} reducedMotion={reducedMotion} transitioning={transitioning} enterGalaxy={enterGalaxy} />
        <HomeAvatar mode={mode} pointer={pointer} reducedMotion={reducedMotion} />
        <HomeGround mode={mode} reducedMotion={reducedMotion} onBloom={() => setMode("speaking")} />
        <HomeOrb state={state} pointer={pointer} reducedMotion={reducedMotion} onOpen={openOrb} />

        <section className="pointer-events-none relative z-[9] mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[12vh] text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.58em] text-cyan-100/58">URAI</p>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.36em] text-emerald-100/52">{state.eyebrow}</p>
          <h1 className="mt-4 max-w-6xl text-5xl font-black leading-[0.9] tracking-[-0.085em] text-white sm:text-6xl md:text-8xl">
            {state.title}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base md:text-lg">
            {state.body}
          </p>

          <div className="pointer-events-auto mt-auto flex flex-wrap justify-center gap-3 pb-12">
            <button
              type="button"
              onMouseEnter={() => setMode("hover")}
              onFocus={() => setMode("hover")}
              onClick={enterGalaxy}
              className="rounded-full bg-cyan-100 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_40px_rgba(186,230,253,.28)] transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-100/80"
            >
              Enter Memory Galaxy
            </button>
            <button
              type="button"
              onClick={openOrb}
              className="rounded-full border border-white/16 bg-white/[0.08] px-6 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/[0.13] focus:outline-none focus:ring-2 focus:ring-cyan-100/60"
            >
              Talk to URAI
            </button>
            <button
              type="button"
              onMouseEnter={() => setMode("privacy-locked")}
              onFocus={() => setMode("privacy-locked")}
              onClick={() => setMode("privacy-locked")}
              className="rounded-full border border-emerald-200/20 bg-emerald-300/[0.08] px-6 py-3 text-sm font-bold text-emerald-50 backdrop-blur-xl transition hover:bg-emerald-300/[0.13] focus:outline-none focus:ring-2 focus:ring-emerald-100/60"
            >
              Privacy Controls
            </button>
          </div>
        </section>

        <div className={`pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_50%_40%,rgba(224,242,254,.28),rgba(2,6,23,.98)_62%)] transition-all duration-700 ${transitioning ? "scale-150 opacity-100" : "scale-100 opacity-0"}`} />

        <style jsx global>{`
          @keyframes uraiAuroraWide { 0%,100% { opacity:.42; transform:translateX(-50%) scaleX(.9); } 50% { opacity:.92; transform:translateX(-50%) scaleX(1.08); } }
          @keyframes uraiAuroraLeft { 0%,100% { transform:translate3d(0,0,0) rotate(-18deg); opacity:.45; } 50% { transform:translate3d(24px,-24px,0) rotate(-10deg); opacity:.86; } }
          @keyframes uraiAuroraRight { 0%,100% { transform:translate3d(0,0,0) rotate(18deg); opacity:.45; } 50% { transform:translate3d(-24px,-18px,0) rotate(10deg); opacity:.86; } }
          @keyframes uraiStar { 0%,100% { opacity:.35; transform:scale(.85); } 50% { opacity:1; transform:scale(1.35); } }
          @keyframes uraiAvatarFloat { 0%,100% { transform:translateX(-50%) translateY(0) scale(.96); } 50% { transform:translateX(-50%) translateY(-12px) scale(1.04); } }
          @keyframes uraiAvatarBreath { 0%,100% { opacity:.64; transform:translateX(-50%) scale(.96); } 50% { opacity:1; transform:translateX(-50%) scale(1.04); } }
          @keyframes uraiGroundBloom { 0%,100% { opacity:.45; transform:translateX(-50%) scale(.9); } 50% { opacity:.95; transform:translateX(-50%) scale(1.08); } }
          @keyframes uraiOrbAura { 0%,100% { opacity:.55; transform:scale(.94); } 50% { opacity:1; transform:scale(1.05); } }
          @keyframes uraiOrbit { from { transform:translate(-50%,-50%) rotate(0deg); } to { transform:translate(-50%,-50%) rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration:.001ms!important;
              animation-iteration-count:1!important;
              scroll-behavior:auto!important;
              transition-duration:.001ms!important;
            }
          }
        `}</style>
      </main>

      <OrbChatDrawer
        open={orbOpen}
        onClose={() => setOrbOpen(false)}
        context={{
          todayMoodState: state.mode,
          mentalLoadScore: state.mode === "threshold" ? 0.82 : 0.42,
          rhythmState: state.mode,
          lastNarratorInsight: state.body,
          recentTimelineEvents: ["Tier 5 home opened", "Orb ready", "Memory Galaxy available"],
          relationshipSignals: ["private by default", "user controlled"],
          userTonePreference: "direct",
        }}
      />
    </>
  );
}
