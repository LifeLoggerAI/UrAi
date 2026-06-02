"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";

type PointerState = { x: number; y: number };

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

const stars = [
  ["6%", "17%", "2px"], ["13%", "42%", "2px"], ["24%", "22%", "3px"],
  ["38%", "12%", "2px"], ["51%", "8%", "3px"], ["68%", "17%", "2px"],
  ["82%", "29%", "3px"], ["94%", "52%", "2px"], ["74%", "63%", "2px"],
  ["31%", "64%", "2px"], ["16%", "70%", "2px"],
];

export default function HomeView(): React.ReactElement {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [orbOpen, setOrbOpen] = useState(false);
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [transitioning, setTransitioning] = useState(false);
  const [bloom, setBloom] = useState(false);

  function enterGalaxy() {
    setTransitioning(true);
    vibrate(18);
    window.setTimeout(() => router.push("/life-map"), reducedMotion ? 80 : 700);
  }

  function openOrb() {
    vibrate(12);
    setOrbOpen(true);
  }

  const skyMove = reducedMotion ? undefined : {
    transform: `translate3d(${pointer.x * -18}px, ${pointer.y * -10}px, 0) scale(${transitioning ? 1.2 : 1})`,
  };

  const orbMove = reducedMotion ? undefined : {
    transform: `translate3d(${pointer.x * 18}px, ${pointer.y * 12}px, 0)`,
  };

  const avatarMove = reducedMotion ? undefined : {
    transform: `translate3d(calc(-50% + ${pointer.x * 10}px), calc(-50% + ${pointer.y * 8}px), 0)`,
  };

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
        {/* Real-feeling layered sky */}
        <button
          type="button"
          onClick={enterGalaxy}
          aria-label="Enter Memory Galaxy"
          className="absolute inset-x-0 top-0 z-20 h-[46%] cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-100/50"
        />

        <div className="pointer-events-none absolute inset-[-5%] transition-transform duration-700" style={skyMove}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.30),transparent_16%),radial-gradient(circle_at_27%_31%,rgba(34,211,238,.30),transparent_30%),radial-gradient(circle_at_76%_30%,rgba(168,85,247,.26),transparent_32%),radial-gradient(circle_at_50%_74%,rgba(16,185,129,.22),transparent_34%),linear-gradient(180deg,#01030a_0%,#071827_48%,#04140f_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.82),transparent_23%,transparent_75%,rgba(0,0,0,.72)),linear-gradient(180deg,rgba(0,0,0,.25),transparent_47%,rgba(0,0,0,.78))]" />

          <div className={`${reducedMotion ? "" : "animate-[uraiAuroraWide_14s_ease-in-out_infinite]"} absolute left-1/2 top-[16%] h-44 w-[90rem] -translate-x-1/2 rounded-[50%] bg-cyan-100/12 blur-3xl`} />
          <div className={`${reducedMotion ? "" : "animate-[uraiAuroraLeft_12s_ease-in-out_infinite]"} absolute left-[9%] top-[22%] h-[28rem] w-[34rem] rotate-[-18deg] rounded-[50%] bg-emerald-300/12 blur-3xl`} />
          <div className={`${reducedMotion ? "" : "animate-[uraiAuroraRight_15s_ease-in-out_infinite_reverse]"} absolute right-[4%] top-[20%] h-[30rem] w-[36rem] rotate-[18deg] rounded-[50%] bg-violet-300/13 blur-3xl`} />

          <div className="absolute left-1/2 top-[26%] h-[1px] w-[82rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/24 to-transparent" />
          <div className="absolute left-1/2 top-[35%] h-[1px] w-[70rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-100/14 to-transparent" />

          {stars.map(([left, top, size], index) => (
            <span
              key={index}
              className={`${reducedMotion ? "" : "animate-[uraiStar_4s_ease-in-out_infinite]"} absolute rounded-full bg-cyan-100/75 shadow-[0_0_20px_rgba(186,230,253,.9)]`}
              style={{ left, top, width: size, height: size, animationDelay: `${index * 0.19}s` }}
            />
          ))}
        </div>

        {/* Avatar / companion presence */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[52%] z-[4] h-[44rem] w-[30rem] opacity-95"
          style={avatarMove}
        >
          <div className={`${reducedMotion ? "" : "animate-[uraiAvatarFloat_7s_ease-in-out_infinite]"} absolute left-1/2 top-[0] h-40 w-40 -translate-x-1/2 rounded-full border border-cyan-100/12 bg-[radial-gradient(circle_at_38%_28%,rgba(255,255,255,.52),rgba(125,211,252,.20)_38%,rgba(15,23,42,.06)_74%,transparent)] blur-[.4px]`} />
          <div className={`${reducedMotion ? "" : "animate-[uraiAvatarBreath_6s_ease-in-out_infinite]"} absolute left-1/2 top-[22%] h-[31rem] w-[18rem] -translate-x-1/2 rounded-[48%] border border-cyan-100/12 bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,.27),rgba(14,165,233,.13)_42%,rgba(2,6,23,.04)_70%,transparent)] blur-[.2px]`} />
          <div className="absolute left-1/2 top-[48%] h-80 w-[1px] -translate-x-1/2 bg-gradient-to-b from-cyan-100/25 to-transparent" />
          <div className="absolute left-1/2 top-[19%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-cyan-100/6" />
        </div>

        {/* Ground */}
        <button
          type="button"
          onClick={() => setBloom((value) => !value)}
          aria-label="Activate recovery ground"
          className="absolute inset-x-0 bottom-0 z-[5] h-[48%] overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-emerald-100/30"
        >
          <div className="absolute inset-x-[-12%] bottom-[-34%] h-[90%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,.32),rgba(22,101,52,.28)_35%,rgba(15,23,42,.92)_62%,rgba(2,6,23,1)_81%)]" />
          <div className="absolute left-1/2 bottom-[19%] h-[1px] w-[78rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-100/25 to-transparent" />
          <div className={`${reducedMotion ? "" : "animate-[uraiGroundBloom_7s_ease-in-out_infinite]"} absolute left-1/2 bottom-[10%] h-48 w-[64rem] -translate-x-1/2 rounded-[50%] blur-2xl ${bloom ? "bg-emerald-200/36" : "bg-cyan-200/14"}`} />
          <div className="absolute left-1/2 bottom-[3%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(186,230,253,.14),transparent_66%)]" />
          <div className="absolute left-1/2 bottom-[25%] h-40 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,.13),transparent_70%)]" />
        </button>

        {/* Living orb */}
        <div className="pointer-events-none absolute left-1/2 top-[57%] z-[8] h-[40rem] w-[min(40rem,94vw)] -translate-x-1/2 -translate-y-1/2" style={orbMove}>
          <div className={`${reducedMotion ? "" : "animate-[uraiOrbAura_5s_ease-in-out_infinite]"} absolute inset-0 rounded-full bg-cyan-200/12 blur-3xl`} />
          <div className="absolute left-1/2 top-1/2 h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/14 bg-[radial-gradient(circle_at_34%_27%,rgba(255,255,255,.99),rgba(186,230,253,.78)_12%,rgba(34,211,238,.44)_28%,rgba(8,47,73,.80)_52%,rgba(2,6,23,.99)_78%)] shadow-[0_0_170px_rgba(186,230,253,.58)]" />
          <div className={`${reducedMotion ? "" : "animate-[uraiOrbit_15s_linear_infinite]"} absolute left-1/2 top-1/2 h-[25rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-100/18`} />
          <div className={`${reducedMotion ? "" : "animate-[uraiOrbit_20s_linear_infinite_reverse]"} absolute left-1/2 top-1/2 h-[17rem] w-[39rem] -translate-x-1/2 -translate-y-1/2 rotate-[-14deg] rounded-[50%] border border-white/18`} />
          <div className="absolute left-1/2 top-1/2 h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/45 bg-cyan-100/14 shadow-[0_0_92px_rgba(186,230,253,.55)] backdrop-blur-xl" />
        </div>

        <button
          type="button"
          onClick={openOrb}
          aria-label="Talk to URAI"
          className="absolute left-1/2 top-[57%] z-[10] grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-black uppercase tracking-[0.28em] text-white focus:outline-none focus:ring-2 focus:ring-cyan-100/80"
        >
          URAI
        </button>

        {/* Minimal cinematic copy */}
        <section className="pointer-events-none relative z-[9] mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[12vh] text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.58em] text-cyan-100/58">URAI</p>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.36em] text-emerald-100/52">Tier 5 · Home World Locked</p>
          <h1 className="mt-4 max-w-6xl text-5xl font-black leading-[0.9] tracking-[-0.085em] text-white sm:text-6xl md:text-8xl">
            The home world is alive.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base md:text-lg">
            Orb, sky, ground, avatar, privacy, and Memory Galaxy move as one system.
          </p>

          <div className="pointer-events-auto mt-auto flex flex-wrap justify-center gap-3 pb-12">
            <button
              type="button"
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
              onClick={() => setBloom((value) => !value)}
              className="rounded-full border border-emerald-200/20 bg-emerald-300/[0.08] px-6 py-3 text-sm font-bold text-emerald-50 backdrop-blur-xl transition hover:bg-emerald-300/[0.13] focus:outline-none focus:ring-2 focus:ring-emerald-100/60"
            >
              Bloom Ground
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
          todayMoodState: "tier 5 home world active",
          mentalLoadScore: 0.42,
          rhythmState: bloom ? "ground-bloom" : "home-world",
          lastNarratorInsight: "The home world is alive: orb, sky, ground, avatar, privacy, and Memory Galaxy move as one system.",
          recentTimelineEvents: ["Tier 5 home opened", "Orb ready", "Memory Galaxy available"],
          relationshipSignals: ["private by default", "user controlled"],
          userTonePreference: "direct",
        }}
      />
    </>
  );
}
