"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";

type HomeMode = "quiet" | "listening" | "thinking" | "speaking" | "memory" | "bloom" | "threshold" | "privacy";
type PointerState = { x: number; y: number };

type HomeState = {
  eyebrow: string;
  title: string;
  body: string;
  orb: string;
  accent: string;
  companion: string;
};

const modeCopy: Record<HomeMode, HomeState> = {
  quiet: {
    eyebrow: "Private world online",
    title: "Your inner world is awake",
    body: "A living sky, ground, orb, and companion field for memory, recovery, reflection, and the quiet patterns that shape your life.",
    orb: "Idle",
    accent: "cyan",
    companion: "Companion present, quiet by default",
  },
  listening: {
    eyebrow: "Orb listening",
    title: "Speak softly. URAI is here.",
    body: "The orb opens without pressure: one thought, one memory, or silence is enough.",
    orb: "Listen",
    accent: "sky",
    companion: "Companion leaning in",
  },
  thinking: {
    eyebrow: "Pattern field active",
    title: "The signal is becoming meaning.",
    body: "URAI is holding context, weighing rhythm, and turning fragments into a gentler map.",
    orb: "Think",
    accent: "violet",
    companion: "Companion processing quietly",
  },
  speaking: {
    eyebrow: "Narrator ready",
    title: "A reflection is ready to surface.",
    body: "When URAI speaks, it should feel calm, useful, and timed to your nervous system.",
    orb: "Speak",
    accent: "teal",
    companion: "Companion voice active",
  },
  memory: {
    eyebrow: "Memory Galaxy ready",
    title: "The sky can become a map.",
    body: "Move from home into memory, recovery, shadow, joy, and legacy through the galaxy above you.",
    orb: "Map",
    accent: "cyan",
    companion: "Companion opening the sky",
  },
  bloom: {
    eyebrow: "Ground bloom forming",
    title: "Something in you is growing back.",
    body: "The ground holds recovery, momentum, rest, and the subtle return of energy over time.",
    orb: "Bloom",
    accent: "emerald",
    companion: "Companion stabilizing the field",
  },
  threshold: {
    eyebrow: "Threshold mode available",
    title: "You do not have to cross alone.",
    body: "When life gets sharp, URAI can soften the interface and hold only what matters.",
    orb: "Hold",
    accent: "amber",
    companion: "Companion standing close",
  },
  privacy: {
    eyebrow: "Privacy locked",
    title: "You control the whole field.",
    body: "Capture, memory, voice, location, export, and deletion should always remain yours to govern.",
    orb: "Lock",
    accent: "emerald",
    companion: "Companion behind consent boundary",
  },
};

const stars = [
  ["7%", "22%", "2px"], ["15%", "49%", "3px"], ["25%", "28%", "2px"], ["36%", "15%", "2px"],
  ["50%", "10%", "3px"], ["64%", "19%", "2px"], ["77%", "30%", "3px"], ["91%", "55%", "2px"],
  ["84%", "18%", "2px"], ["58%", "65%", "2px"], ["42%", "62%", "2px"], ["12%", "67%", "2px"],
];

const particles = [
  ["18%", "42%", "0s"], ["27%", "27%", ".4s"], ["66%", "33%", ".8s"], ["78%", "48%", "1.2s"],
  ["50%", "20%", "1.6s"], ["40%", "61%", "2s"], ["60%", "60%", "2.4s"], ["31%", "50%", "2.8s"],
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

function accentGlow(mode: HomeMode) {
  if (mode === "bloom" || mode === "privacy") return "rgba(110,231,183,.45)";
  if (mode === "threshold") return "rgba(251,191,36,.42)";
  if (mode === "thinking") return "rgba(196,181,253,.44)";
  return "rgba(186,230,253,.52)";
}

function SkyLayer({ mode, pointer, transitioning, reducedMotion }: { mode: HomeMode; pointer: PointerState; transitioning: boolean; reducedMotion: boolean }) {
  const transform = reducedMotion ? undefined : `translate3d(${pointer.x * -10}px, ${pointer.y * -8}px, 0) scale(${transitioning ? 1.18 : 1})`;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(224,242,254,.34),transparent_23%),radial-gradient(circle_at_20%_74%,rgba(45,212,191,.17),transparent_31%),radial-gradient(circle_at_84%_34%,rgba(168,85,247,.17),transparent_26%),linear-gradient(180deg,#02030a_0%,#06182a_46%,#03120d_100%)] transition-transform duration-700" style={{ transform }} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.76),transparent_26%,transparent_74%,rgba(0,0,0,.66)),linear-gradient(180deg,rgba(0,0,0,.22),transparent_48%,rgba(0,0,0,.68))]" />
      <div className={`absolute left-1/2 top-[18%] h-28 w-[50rem] -translate-x-1/2 rounded-[50%] bg-cyan-200/10 blur-3xl ${reducedMotion ? "" : "animate-[uraiSkyShimmer_9s_ease-in-out_infinite]"}`} />
      <div className={`absolute left-[8%] top-[20%] h-64 w-64 rounded-full bg-blue-300/10 blur-3xl ${reducedMotion ? "" : "animate-[uraiFloat_11s_ease-in-out_infinite]"}`} />
      <div className={`absolute right-[6%] top-[24%] h-72 w-72 rounded-full bg-violet-300/10 blur-3xl ${reducedMotion ? "" : "animate-[uraiFloat_13s_ease-in-out_infinite_reverse]"}`} />
      {stars.map(([left, top, size], index) => (
        <span key={index} className={`absolute rounded-full bg-cyan-100/70 shadow-[0_0_18px_rgba(186,230,253,.85)] ${reducedMotion ? "" : "animate-[uraiTwinkle_4s_ease-in-out_infinite]"}`} style={{ left, top, width: size, height: size, animationDelay: `${index * 0.21}s` }} />
      ))}
      <button type="button" tabIndex={-1} className={`absolute left-1/2 top-[26%] h-24 w-[58rem] -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-transparent via-cyan-100/10 to-transparent transition-opacity duration-500 ${mode === "memory" || transitioning ? "opacity-100" : "opacity-35"}`} aria-label="Sky gateway to Memory Galaxy" />
    </div>
  );
}

function GroundLayer({ mode, pointer, reducedMotion, onBloom }: { mode: HomeMode; pointer: PointerState; reducedMotion: boolean; onBloom: () => void }) {
  const transform = reducedMotion ? undefined : `translate3d(${pointer.x * 7}px, ${pointer.y * 4}px, 0)`;
  return (
    <button type="button" onClick={onBloom} className="absolute inset-x-0 bottom-0 h-[45%] overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-emerald-100/30" style={{ transform }} aria-label="Activate ground bloom state">
      <div className="absolute inset-x-[-10%] bottom-[-28%] h-[84%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,.32),rgba(22,101,52,.24)_34%,rgba(15,23,42,.9)_62%,rgba(2,6,23,1)_78%)]" />
      <div className={`absolute left-1/2 bottom-[11%] h-32 w-[44rem] -translate-x-1/2 rounded-[50%] blur-2xl ${mode === "bloom" ? "bg-emerald-200/32" : "bg-cyan-200/12"} ${reducedMotion ? "" : "animate-[uraiGroundBloom_6s_ease-in-out_infinite]"}`} />
      <div className={`absolute left-1/2 bottom-[24%] h-[1px] w-[52rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-100/18 to-transparent ${reducedMotion ? "" : "animate-[uraiWave_8s_ease-in-out_infinite]"}`} />
      <div className="absolute left-1/2 bottom-[5%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(186,230,253,.11),transparent_65%)]" />
    </button>
  );
}

function AvatarLayer({ mode, pointer, reducedMotion }: { mode: HomeMode; pointer: PointerState; reducedMotion: boolean }) {
  const transform = reducedMotion ? undefined : `translate3d(calc(-50% + ${pointer.x * 5}px), calc(-50% + ${pointer.y * 8}px), 0)`;
  return (
    <div className="pointer-events-none absolute left-1/2 top-[44%] h-[25rem] w-[18rem]" style={{ transform }} aria-hidden="true">
      <div className={`absolute left-1/2 top-[3%] h-28 w-28 -translate-x-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_36%_28%,rgba(255,255,255,.4),rgba(125,211,252,.18)_38%,rgba(15,23,42,.22)_72%)] blur-[1px] transition-opacity duration-700 ${mode === "listening" || mode === "speaking" ? "opacity-85" : "opacity-45"} ${reducedMotion ? "" : "animate-[uraiAvatarEmerge_7s_ease-in-out_infinite]"}`} />
      <div className={`absolute left-1/2 top-[28%] h-64 w-40 -translate-x-1/2 rounded-[48%] border border-cyan-100/10 bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,.22),rgba(14,165,233,.12)_42%,rgba(2,6,23,.08)_72%,transparent)] blur-[.3px] transition-opacity duration-700 ${mode === "quiet" ? "opacity-45" : "opacity-80"} ${reducedMotion ? "" : "animate-[uraiBreath_5.5s_ease-in-out_infinite]"}`} />
      <div className="absolute left-1/2 top-[52%] h-52 w-[1px] -translate-x-1/2 bg-gradient-to-b from-cyan-100/20 to-transparent" />
    </div>
  );
}

function OrbLayer({ mode, onOpen, pointer, reducedMotion, label }: { mode: HomeMode; onOpen: () => void; pointer: PointerState; reducedMotion: boolean; label: string }) {
  const transform = reducedMotion ? undefined : `translate3d(${pointer.x * 12}px, ${pointer.y * 10}px, 0)`;
  const glow = accentGlow(mode);
  return (
    <div className="relative h-[25rem] w-[min(25rem,78vw)] transition-transform duration-500" style={{ transform }}>
      <div className={`absolute inset-0 rounded-full bg-cyan-200/10 blur-3xl ${reducedMotion ? "" : "animate-[uraiBreath_5s_ease-in-out_infinite]"}`} />
      <div className="absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 bg-[radial-gradient(circle_at_36%_28%,rgba(255,255,255,.96),rgba(165,243,252,.58)_18%,rgba(8,47,73,.62)_45%,rgba(2,6,23,.96)_73%)]" style={{ boxShadow: `0 0 130px ${glow}` }} />
      <div className={`absolute left-1/2 top-1/2 h-[19rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-100/10 ${reducedMotion ? "" : "animate-[uraiOrbit_12s_linear_infinite]"}`} />
      <div className={`absolute left-1/2 top-1/2 h-[13rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rotate-[-14deg] rounded-[50%] border border-cyan-100/12 ${reducedMotion ? "" : "animate-[uraiOrbit_16s_linear_infinite_reverse]"}`} />
      {particles.map(([left, top, delay], index) => (
        <span key={index} className={`absolute h-1.5 w-1.5 rounded-full bg-cyan-100/65 shadow-[0_0_16px_rgba(186,230,253,.8)] ${reducedMotion ? "" : "animate-[uraiParticle_4.8s_ease-in-out_infinite]"}`} style={{ left, top, animationDelay: delay }} />
      ))}
      <button type="button" aria-label={`Open URAI orb in ${label} state`} onClick={onOpen} className={`absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-100/40 bg-cyan-200/15 text-[11px] font-semibold uppercase tracking-[0.27em] text-white shadow-[0_0_70px_rgba(186,230,253,.42)] backdrop-blur-xl transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-100/70 ${mode === "listening" || mode === "speaking" ? "scale-105" : ""} ${reducedMotion ? "" : "animate-[uraiOrbPulse_3.8s_ease-in-out_infinite]"}`}>{label}</button>
      <div className="absolute left-[2%] top-[45%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Memory</div>
      <div className="absolute right-[2%] top-[38%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Recovery</div>
      <div className="absolute bottom-[14%] left-[17%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Shadow</div>
      <div className="absolute bottom-[17%] right-[18%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Joy</div>
    </div>
  );
}

export default function HomeView(): React.ReactElement {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [orbOpen, setOrbOpen] = useState(false);
  const [mode, setMode] = useState<HomeMode>("quiet");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [transitioning, setTransitioning] = useState(false);
  const copy = useMemo(() => modeCopy[mode], [mode]);

  function enterMemoryGalaxy() {
    setMode("memory");
    setTransitioning(true);
    if (navigator.vibrate) navigator.vibrate(18);
    window.setTimeout(() => router.push("/life-map"), reducedMotion ? 80 : 650);
  }

  function openOrb() {
    setMode("listening");
    if (navigator.vibrate) navigator.vibrate(12);
    setOrbOpen(true);
  }

  return (
    <>
      <main
        className={`relative min-h-screen overflow-hidden bg-[#02040b] text-white ${transitioning ? "cursor-wait" : ""}`}
        onPointerMove={(event) => {
          if (reducedMotion) return;
          const x = event.clientX / window.innerWidth - 0.5;
          const y = event.clientY / window.innerHeight - 0.5;
          setPointer({ x, y });
        }}
        onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      >
        <SkyLayer mode={mode} pointer={pointer} transitioning={transitioning} reducedMotion={reducedMotion} />
        <GroundLayer mode={mode} pointer={pointer} reducedMotion={reducedMotion} onBloom={() => setMode("bloom")} />
        <AvatarLayer mode={mode} pointer={pointer} reducedMotion={reducedMotion} />
        <div className={`pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_38%,rgba(224,242,254,.28),rgba(2,6,23,.96)_62%)] transition-all duration-700 ${transitioning ? "scale-150 opacity-100" : "scale-100 opacity-0"}`} />

        <div className="absolute left-4 right-4 top-4 z-30 flex items-center justify-between gap-3 text-xs text-white/55">
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 backdrop-blur-xl">{copy.companion}</span>
          <button type="button" onClick={() => setSoundEnabled((value) => !value)} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 backdrop-blur-xl transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-100/50" aria-pressed={soundEnabled}>{soundEnabled ? "Sound on" : "Sound off"}</button>
        </div>

        <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pb-10 pt-20 text-center md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.52em] text-cyan-100/60">URAI</p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.36em] text-emerald-100/50">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black tracking-[-0.075em] text-white md:text-7xl">{copy.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 md:text-lg">{copy.body}</p>

          <div className="mt-7 flex max-w-3xl flex-wrap justify-center gap-2">
            {(["quiet", "listening", "thinking", "speaking", "memory", "bloom", "threshold", "privacy"] as HomeMode[]).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/60 ${mode === item ? "border-cyan-100/40 bg-cyan-100/15 text-cyan-50" : "border-white/10 bg-white/[0.05] text-white/45 hover:text-white/80"}`}>{item}</button>
            ))}
          </div>

          <div className="mt-8"><OrbLayer mode={mode} pointer={pointer} reducedMotion={reducedMotion} label={copy.orb} onOpen={openOrb} /></div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onMouseEnter={() => setMode("memory")} onFocus={() => setMode("memory")} onClick={enterMemoryGalaxy} className="rounded-full bg-cyan-100 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_36px_rgba(186,230,253,.22)] transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-100/80">Enter Memory Galaxy</button>
            <button type="button" onClick={openOrb} className="rounded-full border border-white/14 bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.13] focus:outline-none focus:ring-2 focus:ring-cyan-100/60">Talk to URAI</button>
            <Link href="/settings/privacy" onMouseEnter={() => setMode("privacy")} onFocus={() => setMode("privacy")} className="rounded-full border border-emerald-200/20 bg-emerald-300/[0.08] px-6 py-3 text-sm font-semibold text-emerald-50 backdrop-blur-xl transition hover:bg-emerald-300/[0.13] focus:outline-none focus:ring-2 focus:ring-emerald-100/60">Privacy Controls</Link>
          </div>

          <p className="mt-7 max-w-xl text-sm leading-6 text-white/52">Private by default. You control what is captured, exported, or deleted.</p>
        </section>

        <style jsx global>{`
          @keyframes uraiSkyShimmer { 0%,100% { opacity: .45; transform: translateX(-50%) scaleX(.9); } 50% { opacity: .95; transform: translateX(-50%) scaleX(1.05); } }
          @keyframes uraiFloat { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(12px,-16px,0); } }
          @keyframes uraiTwinkle { 0%,100% { opacity: .35; transform: scale(.85); } 50% { opacity: 1; transform: scale(1.35); } }
          @keyframes uraiGroundBloom { 0%,100% { opacity: .45; transform: translateX(-50%) scale(.9); } 50% { opacity: .95; transform: translateX(-50%) scale(1.08); } }
          @keyframes uraiWave { 0%,100% { opacity: .25; transform: translateX(-50%) scaleX(.85); } 50% { opacity: .75; transform: translateX(-50%) scaleX(1.08); } }
          @keyframes uraiAvatarEmerge { 0%,100% { transform: translateX(-50%) translateY(0) scale(.96); } 50% { transform: translateX(-50%) translateY(-8px) scale(1.03); } }
          @keyframes uraiBreath { 0%,100% { opacity: .68; transform: scale(.96); } 50% { opacity: 1; transform: scale(1.04); } }
          @keyframes uraiOrbit { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
          @keyframes uraiParticle { 0%,100% { opacity: .12; transform: translate3d(0,0,0) scale(.7); } 50% { opacity: .95; transform: translate3d(0,-18px,0) scale(1.18); } }
          @keyframes uraiOrbPulse { 0%,100% { box-shadow: 0 0 50px rgba(186,230,253,.28); } 50% { box-shadow: 0 0 88px rgba(186,230,253,.58); } }
          @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .001ms !important; } }
        `}</style>
      </main>

      <OrbChatDrawer
        open={orbOpen}
        onClose={() => setOrbOpen(false)}
        context={{
          todayMoodState: mode === "bloom" ? "recovering" : mode === "memory" ? "reflective" : mode === "threshold" ? "threshold" : "quiet and awake",
          mentalLoadScore: mode === "threshold" ? 0.82 : 0.42,
          rhythmState: mode,
          lastNarratorInsight: copy.body,
          recentTimelineEvents: ["Home opened", "Orb ready", "Memory Galaxy available", "Privacy controls ready"],
          relationshipSignals: ["private by default", "user controlled"],
          userTonePreference: "direct",
        }}
      />
    </>
  );
}
