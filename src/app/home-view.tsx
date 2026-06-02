"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";

type HomeTier = 1 | 2 | 3 | 4 | 5;
type PointerState = { x: number; y: number };

const tierCopy: Record<HomeTier, { eyebrow: string; title: string; body: string; orb: string }> = {
  1: {
    eyebrow: "Tier 1 · Orb Awake",
    title: "Your inner world is awake.",
    body: "The orb is your private entry point: quiet, present, and ready when you are.",
    orb: "Awake",
  },
  2: {
    eyebrow: "Tier 2 · Sky Memory",
    title: "The sky remembers patterns.",
    body: "Your Memory Galaxy opens through the sky, not through menus.",
    orb: "Galaxy",
  },
  3: {
    eyebrow: "Tier 3 · Ground Recovery",
    title: "The ground holds your recovery.",
    body: "Bloom, rest, shadow, and renewal live beneath the orb.",
    orb: "Bloom",
  },
  4: {
    eyebrow: "Tier 4 · Avatar Presence",
    title: "A companion begins to emerge.",
    body: "URAI should feel like a presence, not a dashboard.",
    orb: "Listen",
  },
  5: {
    eyebrow: "Tier 5 · Whole World Locked",
    title: "The home world is alive.",
    body: "Orb, sky, ground, avatar, privacy, and Memory Galaxy move as one system.",
    orb: "Enter",
  },
};

const stars = [
  ["8%", "18%", "2px"], ["17%", "46%", "3px"], ["29%", "23%", "2px"],
  ["42%", "13%", "2px"], ["53%", "8%", "3px"], ["67%", "19%", "2px"],
  ["78%", "29%", "3px"], ["90%", "51%", "2px"], ["84%", "15%", "2px"],
  ["60%", "62%", "2px"], ["38%", "61%", "2px"], ["12%", "66%", "2px"],
];

const memoryNodes = [
  ["12%", "48%", "Memory"],
  ["82%", "42%", "Recovery"],
  ["22%", "77%", "Shadow"],
  ["74%", "76%", "Joy"],
  ["50%", "7%", "Galaxy"],
];

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

function tierGlow(tier: HomeTier) {
  if (tier === 1) return "rgba(186,230,253,.55)";
  if (tier === 2) return "rgba(125,211,252,.68)";
  if (tier === 3) return "rgba(110,231,183,.62)";
  if (tier === 4) return "rgba(196,181,253,.62)";
  return "rgba(255,255,255,.78)";
}

function SkyWorld({
  tier,
  pointer,
  reducedMotion,
  transitioning,
  enterGalaxy,
}: {
  tier: HomeTier;
  pointer: PointerState;
  reducedMotion: boolean;
  transitioning: boolean;
  enterGalaxy: () => void;
}) {
  const transform = reducedMotion
    ? undefined
    : `translate3d(${pointer.x * -18}px, ${pointer.y * -12}px, 0) scale(${transitioning ? 1.22 : 1})`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <button
        type="button"
        onClick={enterGalaxy}
        aria-label="Tap the sky to enter Memory Galaxy"
        className="absolute inset-x-0 top-0 z-[3] h-[46%] cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-100/50"
      />

      <div className="pointer-events-none absolute inset-[-4%] transition-transform duration-700" style={{ transform }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.28),transparent_18%),radial-gradient(circle_at_28%_26%,rgba(56,189,248,.28),transparent_28%),radial-gradient(circle_at_78%_27%,rgba(168,85,247,.26),transparent_30%),radial-gradient(circle_at_50%_70%,rgba(16,185,129,.22),transparent_32%),linear-gradient(180deg,#02030a_0%,#071827_45%,#03140f_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.78),transparent_24%,transparent_74%,rgba(0,0,0,.70)),linear-gradient(180deg,rgba(0,0,0,.28),transparent_48%,rgba(0,0,0,.76))]" />

        <div className={`${reducedMotion ? "" : "animate-[uraiSkyDrift_12s_ease-in-out_infinite]"} absolute left-1/2 top-[19%] h-40 w-[74rem] -translate-x-1/2 rounded-[50%] bg-cyan-100/12 blur-3xl`} />
        <div className={`${reducedMotion ? "" : "animate-[uraiAurora_10s_ease-in-out_infinite]"} absolute left-[12%] top-[24%] h-80 w-[28rem] rotate-[-18deg] rounded-[50%] bg-emerald-300/10 blur-3xl`} />
        <div className={`${reducedMotion ? "" : "animate-[uraiAurora_13s_ease-in-out_infinite_reverse]"} absolute right-[8%] top-[20%] h-80 w-[30rem] rotate-[18deg] rounded-[50%] bg-violet-300/12 blur-3xl`} />

        {stars.map(([left, top, size], index) => (
          <span
            key={index}
            className={`${reducedMotion ? "" : "animate-[uraiTwinkle_4s_ease-in-out_infinite]"} absolute rounded-full bg-cyan-100/75 shadow-[0_0_20px_rgba(186,230,253,.95)]`}
            style={{ left, top, width: size, height: size, animationDelay: `${index * 0.17}s` }}
          />
        ))}
      </div>

      <div className={`pointer-events-none absolute left-1/2 top-[25%] h-24 w-[64rem] -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-transparent via-cyan-100/14 to-transparent transition-opacity duration-500 ${tier >= 2 || transitioning ? "opacity-100" : "opacity-35"}`} />
    </div>
  );
}

function GroundWorld({
  tier,
  pointer,
  reducedMotion,
  onBloom,
}: {
  tier: HomeTier;
  pointer: PointerState;
  reducedMotion: boolean;
  onBloom: () => void;
}) {
  const transform = reducedMotion ? undefined : `translate3d(${pointer.x * 10}px, ${pointer.y * 5}px, 0)`;

  return (
    <button
      type="button"
      onClick={onBloom}
      aria-label="Activate recovery ground"
      className="absolute inset-x-0 bottom-0 z-[4] h-[46%] overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-emerald-100/30"
      style={{ transform }}
    >
      <div className="absolute inset-x-[-10%] bottom-[-31%] h-[88%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,.30),rgba(22,101,52,.26)_35%,rgba(15,23,42,.90)_62%,rgba(2,6,23,1)_80%)]" />
      <div className="absolute left-1/2 bottom-[18%] h-[1px] w-[66rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-100/22 to-transparent" />
      <div className={`${reducedMotion ? "" : "animate-[uraiGroundPulse_6s_ease-in-out_infinite]"} absolute left-1/2 bottom-[10%] h-40 w-[56rem] -translate-x-1/2 rounded-[50%] blur-2xl ${tier >= 3 ? "bg-emerald-200/30" : "bg-cyan-200/12"}`} />
      <div className="absolute left-1/2 bottom-[0%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(186,230,253,.12),transparent_66%)]" />
    </button>
  );
}

function AvatarPresence({
  tier,
  pointer,
  reducedMotion,
}: {
  tier: HomeTier;
  pointer: PointerState;
  reducedMotion: boolean;
}) {
  const transform = reducedMotion
    ? undefined
    : `translate3d(calc(-50% + ${pointer.x * 8}px), calc(-50% + ${pointer.y * 10}px), 0)`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-[48%] z-[5] h-[36rem] w-[24rem] transition-opacity duration-700 ${tier >= 4 ? "opacity-100" : "opacity-35"}`}
      style={{ transform }}
    >
      <div className={`${reducedMotion ? "" : "animate-[uraiAvatarRise_7s_ease-in-out_infinite]"} absolute left-1/2 top-[2%] h-36 w-36 -translate-x-1/2 rounded-full border border-cyan-100/10 bg-[radial-gradient(circle_at_38%_28%,rgba(255,255,255,.48),rgba(125,211,252,.18)_38%,rgba(15,23,42,.08)_74%,transparent)] blur-[.5px]`} />
      <div className={`${reducedMotion ? "" : "animate-[uraiBreath_5.5s_ease-in-out_infinite]"} absolute left-1/2 top-[25%] h-[25rem] w-[15rem] -translate-x-1/2 rounded-[48%] border border-cyan-100/12 bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,.26),rgba(14,165,233,.12)_42%,rgba(2,6,23,.05)_70%,transparent)] blur-[.2px]`} />
      <div className="absolute left-1/2 top-[54%] h-64 w-[1px] -translate-x-1/2 bg-gradient-to-b from-cyan-100/22 to-transparent" />
      <div className="absolute left-1/2 top-[22%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-cyan-100/5" />
    </div>
  );
}

function TierOrb({
  tier,
  pointer,
  reducedMotion,
  onOpen,
}: {
  tier: HomeTier;
  pointer: PointerState;
  reducedMotion: boolean;
  onOpen: () => void;
}) {
  const copy = tierCopy[tier];
  const glow = tierGlow(tier);
  const transform = reducedMotion ? undefined : `translate3d(${pointer.x * 16}px, ${pointer.y * 12}px, 0)`;

  return (
    <div className="relative h-[34rem] w-[min(34rem,88vw)] transition-transform duration-500" style={{ transform }}>
      <div className={`${reducedMotion ? "" : "animate-[uraiBreath_5s_ease-in-out_infinite]"} absolute inset-0 rounded-full bg-cyan-200/10 blur-3xl`} />

      <div
        className="absolute left-1/2 top-1/2 h-[29rem] w-[29rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/12 bg-[radial-gradient(circle_at_34%_27%,rgba(255,255,255,.98),rgba(186,230,253,.76)_12%,rgba(34,211,238,.43)_28%,rgba(8,47,73,.78)_52%,rgba(2,6,23,.98)_78%)]"
        style={{ boxShadow: `0 0 150px ${glow}` }}
      />

      <div className={`${reducedMotion ? "" : "animate-[uraiOrbit_14s_linear_infinite]"} absolute left-1/2 top-1/2 h-[23rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-100/16`} />
      <div className={`${reducedMotion ? "" : "animate-[uraiOrbit_18s_linear_infinite_reverse]"} absolute left-1/2 top-1/2 h-[15rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rotate-[-14deg] rounded-[50%] border border-white/18`} />

      {memoryNodes.map(([left, top, label]) => (
        <div
          key={label}
          className="absolute rounded-full border border-cyan-100/12 bg-white/[0.055] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-50/58 backdrop-blur-md"
          style={{ left, top }}
        >
          {label}
        </div>
      ))}

      <button
        type="button"
        aria-label={`Open URAI orb: ${copy.orb}`}
        onClick={onOpen}
        className={`${reducedMotion ? "" : "animate-[uraiOrbPulse_3.8s_ease-in-out_infinite]"} absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-100/45 bg-cyan-100/14 text-[11px] font-black uppercase tracking-[0.28em] text-white shadow-[0_0_84px_rgba(186,230,253,.5)] backdrop-blur-xl transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-100/80`}
      >
        {copy.orb}
      </button>
    </div>
  );
}

export default function HomeView(): React.ReactElement {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [orbOpen, setOrbOpen] = useState(false);
  const [tier, setTier] = useState<HomeTier>(5);
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [transitioning, setTransitioning] = useState(false);
  const copy = useMemo(() => tierCopy[tier], [tier]);

  function enterMemoryGalaxy() {
    setTier(2);
    setTransitioning(true);
    vibrate(18);
    window.setTimeout(() => router.push("/life-map"), reducedMotion ? 80 : 650);
  }

  function openOrb() {
    setTier(4);
    vibrate(12);
    setOrbOpen(true);
  }

  return (
    <>
      <main
        className={`relative min-h-[100svh] overflow-hidden bg-[#02040b] text-white ${transitioning ? "cursor-wait" : ""}`}
        onPointerMove={(event) => {
          if (reducedMotion) return;
          setPointer({
            x: event.clientX / window.innerWidth - 0.5,
            y: event.clientY / window.innerHeight - 0.5,
          });
        }}
        onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      >
        <SkyWorld tier={tier} pointer={pointer} reducedMotion={reducedMotion} transitioning={transitioning} enterGalaxy={enterMemoryGalaxy} />
        <GroundWorld tier={tier} pointer={pointer} reducedMotion={reducedMotion} onBloom={() => setTier(3)} />
        <AvatarPresence tier={tier} pointer={pointer} reducedMotion={reducedMotion} />

        <div className={`pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_38%,rgba(224,242,254,.32),rgba(2,6,23,.96)_62%)] transition-all duration-700 ${transitioning ? "scale-150 opacity-100" : "scale-100 opacity-0"}`} />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_46%,transparent_0%,transparent_42%,rgba(0,0,0,.26)_74%,rgba(0,0,0,.62)_100%)]" />

        <section className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-16 text-center sm:px-6 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.58em] text-cyan-100/58">URAI</p>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.36em] text-emerald-100/52">{copy.eyebrow}</p>

          <h1 className="mt-4 max-w-6xl text-5xl font-black leading-[0.9] tracking-[-0.085em] text-white sm:text-6xl md:text-8xl">
            {copy.title}
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base md:text-lg">
            {copy.body}
          </p>

          <div className="mt-8">
            <TierOrb tier={tier} pointer={pointer} reducedMotion={reducedMotion} onOpen={openOrb} />
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onMouseEnter={() => setTier(2)}
              onFocus={() => setTier(2)}
              onClick={enterMemoryGalaxy}
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
              onClick={() => setTier(5)}
              className="rounded-full border border-emerald-200/20 bg-emerald-300/[0.08] px-6 py-3 text-sm font-bold text-emerald-50 backdrop-blur-xl transition hover:bg-emerald-300/[0.13] focus:outline-none focus:ring-2 focus:ring-emerald-100/60"
            >
              Tier 5 Locked
            </button>
          </div>

          <p className="mt-6 max-w-xl text-sm leading-6 text-white/54">
            Private by default. You control what is captured, exported, or deleted.
          </p>
        </section>

        <style jsx global>{`
          @keyframes uraiSkyDrift {
            0%,100% { opacity: .45; transform: translateX(-50%) scaleX(.9); }
            50% { opacity: .95; transform: translateX(-50%) scaleX(1.05); }
          }
          @keyframes uraiAurora {
            0%,100% { transform: translate3d(0,0,0) rotate(-18deg); opacity: .45; }
            50% { transform: translate3d(18px,-22px,0) rotate(-10deg); opacity: .85; }
          }
          @keyframes uraiTwinkle {
            0%,100% { opacity: .35; transform: scale(.85); }
            50% { opacity: 1; transform: scale(1.35); }
          }
          @keyframes uraiGroundPulse {
            0%,100% { opacity: .45; transform: translateX(-50%) scale(.9); }
            50% { opacity: .95; transform: translateX(-50%) scale(1.08); }
          }
          @keyframes uraiAvatarRise {
            0%,100% { transform: translateX(-50%) translateY(0) scale(.96); }
            50% { transform: translateX(-50%) translateY(-10px) scale(1.04); }
          }
          @keyframes uraiBreath {
            0%,100% { opacity: .68; transform: scale(.96); }
            50% { opacity: 1; transform: scale(1.04); }
          }
          @keyframes uraiOrbit {
            from { transform: translate(-50%,-50%) rotate(0deg); }
            to { transform: translate(-50%,-50%) rotate(360deg); }
          }
          @keyframes uraiOrbPulse {
            0%,100% { box-shadow: 0 0 55px rgba(186,230,253,.30); }
            50% { box-shadow: 0 0 100px rgba(186,230,253,.65); }
          }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: .001ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
              transition-duration: .001ms !important;
            }
          }
        `}</style>
      </main>

      <OrbChatDrawer
        open={orbOpen}
        onClose={() => setOrbOpen(false)}
        context={{
          todayMoodState: tier >= 4 ? "companion active" : "quiet and awake",
          mentalLoadScore: 0.42,
          rhythmState: `tier-${tier}`,
          lastNarratorInsight: copy.body,
          recentTimelineEvents: ["Tier 5 home opened", "Orb ready", "Memory Galaxy available"],
          relationshipSignals: ["private by default", "user controlled"],
          userTonePreference: "direct",
        }}
      />
    </>
  );
}
