"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";

type HomeMode = "quiet" | "listening" | "memory" | "bloom";

const modeCopy: Record<HomeMode, { eyebrow: string; title: string; body: string }> = {
  quiet: {
    eyebrow: "Private world online",
    title: "Your inner world is awake",
    body: "A living sky, ground, orb, and companion field for memory, recovery, reflection, and the quiet patterns that shape your life.",
  },
  listening: {
    eyebrow: "Orb listening",
    title: "Speak softly. URAI is here.",
    body: "The orb opens without pressure: one thought, one memory, or silence is enough.",
  },
  memory: {
    eyebrow: "Memory Galaxy ready",
    title: "The sky can become a map.",
    body: "Tap into the galaxy when you want to move from the home world into memory, recovery, shadow, joy, and legacy.",
  },
  bloom: {
    eyebrow: "Ground bloom forming",
    title: "Something in you is growing back.",
    body: "The ground holds recovery, momentum, rest, and the subtle return of energy over time.",
  },
};

const stars = [
  ["7%", "22%", "2px"], ["15%", "49%", "3px"], ["25%", "28%", "2px"], ["36%", "15%", "2px"],
  ["50%", "10%", "3px"], ["64%", "19%", "2px"], ["77%", "30%", "3px"], ["91%", "55%", "2px"],
  ["84%", "18%", "2px"], ["58%", "65%", "2px"], ["42%", "62%", "2px"], ["12%", "67%", "2px"],
];

function SkyLayer({ mode }: { mode: HomeMode }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(224,242,254,.34),transparent_23%),radial-gradient(circle_at_20%_74%,rgba(45,212,191,.17),transparent_31%),radial-gradient(circle_at_84%_34%,rgba(168,85,247,.17),transparent_26%),linear-gradient(180deg,#02030a_0%,#06182a_46%,#03120d_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.76),transparent_26%,transparent_74%,rgba(0,0,0,.66)),linear-gradient(180deg,rgba(0,0,0,.22),transparent_48%,rgba(0,0,0,.68))]" />
      <div className="absolute left-1/2 top-[18%] h-28 w-[50rem] -translate-x-1/2 rounded-[50%] bg-cyan-200/10 blur-3xl" />
      <div className="absolute left-[8%] top-[20%] h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />
      <div className="absolute right-[6%] top-[24%] h-72 w-72 rounded-full bg-violet-300/10 blur-3xl" />
      {stars.map(([left, top, size], index) => (
        <span key={index} className="absolute rounded-full bg-cyan-100/70 shadow-[0_0_18px_rgba(186,230,253,.85)]" style={{ left, top, width: size, height: size }} />
      ))}
      <div className={`absolute left-1/2 top-[26%] h-[1px] w-[58rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/20 to-transparent ${mode === "memory" ? "opacity-90" : "opacity-45"}`} />
    </div>
  );
}

function GroundLayer({ mode }: { mode: HomeMode }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] overflow-hidden">
      <div className="absolute inset-x-[-10%] bottom-[-28%] h-[84%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,.32),rgba(22,101,52,.24)_34%,rgba(15,23,42,.9)_62%,rgba(2,6,23,1)_78%)]" />
      <div className={`absolute left-1/2 bottom-[11%] h-32 w-[44rem] -translate-x-1/2 rounded-[50%] blur-2xl ${mode === "bloom" ? "bg-emerald-200/28" : "bg-cyan-200/12"}`} />
      <div className="absolute left-1/2 bottom-[24%] h-[1px] w-[52rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-100/18 to-transparent" />
      <div className="absolute left-1/2 bottom-[5%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(186,230,253,.11),transparent_65%)]" />
    </div>
  );
}

function AvatarLayer({ mode }: { mode: HomeMode }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[44%] h-[25rem] w-[18rem] -translate-x-1/2 -translate-y-1/2">
      <div className={`absolute left-1/2 top-[3%] h-28 w-28 -translate-x-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_36%_28%,rgba(255,255,255,.4),rgba(125,211,252,.18)_38%,rgba(15,23,42,.22)_72%)] blur-[1px] ${mode === "listening" ? "opacity-75" : "opacity-42"}`} />
      <div className={`absolute left-1/2 top-[28%] h-64 w-40 -translate-x-1/2 rounded-[48%] border border-cyan-100/10 bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,.22),rgba(14,165,233,.12)_42%,rgba(2,6,23,.08)_72%,transparent)] blur-[.3px] ${mode === "quiet" ? "opacity-45" : "opacity-70"}`} />
      <div className="absolute left-1/2 top-[52%] h-52 w-[1px] -translate-x-1/2 bg-gradient-to-b from-cyan-100/20 to-transparent" />
    </div>
  );
}

function OrbLayer({ mode, onOpen }: { mode: HomeMode; onOpen: () => void }) {
  return (
    <div className="relative h-[25rem] w-[min(25rem,78vw)]">
      <div className="absolute inset-0 rounded-full bg-cyan-200/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 bg-[radial-gradient(circle_at_36%_28%,rgba(255,255,255,.96),rgba(165,243,252,.58)_18%,rgba(8,47,73,.62)_45%,rgba(2,6,23,.96)_73%)] shadow-[0_0_120px_rgba(125,211,252,.34)]" />
      <div className="absolute left-1/2 top-1/2 h-[19rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-100/10" />
      <div className="absolute left-1/2 top-1/2 h-[13rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rotate-[-14deg] rounded-[50%] border border-cyan-100/12" />
      <button type="button" aria-label="Open URAI orb" onClick={onOpen} className={`absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-100/40 bg-cyan-200/15 text-xs font-semibold uppercase tracking-[0.34em] text-white shadow-[0_0_70px_rgba(186,230,253,.42)] backdrop-blur-xl transition hover:scale-105 ${mode === "listening" ? "scale-105" : ""}`}>Orb</button>
      <div className="absolute left-[2%] top-[45%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Memory</div>
      <div className="absolute right-[2%] top-[38%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Recovery</div>
      <div className="absolute bottom-[14%] left-[17%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Shadow</div>
      <div className="absolute bottom-[17%] right-[18%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Joy</div>
    </div>
  );
}

export default function HomeView(): React.ReactElement {
  const [orbOpen, setOrbOpen] = useState(false);
  const [mode, setMode] = useState<HomeMode>("quiet");
  const copy = useMemo(() => modeCopy[mode], [mode]);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#02040b] text-white">
        <SkyLayer mode={mode} />
        <GroundLayer mode={mode} />
        <AvatarLayer mode={mode} />

        <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12 text-center md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.52em] text-cyan-100/60">URAI</p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.36em] text-emerald-100/50">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black tracking-[-0.075em] text-white md:text-7xl">{copy.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 md:text-lg">{copy.body}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {(["quiet", "listening", "memory", "bloom"] as HomeMode[]).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${mode === item ? "border-cyan-100/40 bg-cyan-100/15 text-cyan-50" : "border-white/10 bg-white/[0.05] text-white/45 hover:text-white/80"}`}>{item}</button>
            ))}
          </div>

          <div className="mt-9"><OrbLayer mode={mode} onOpen={() => { setMode("listening"); setOrbOpen(true); }} /></div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/life-map" onMouseEnter={() => setMode("memory")} className="rounded-full bg-cyan-100 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_36px_rgba(186,230,253,.22)] transition hover:scale-[1.02]">Enter Memory Galaxy</Link>
            <button type="button" onClick={() => { setMode("listening"); setOrbOpen(true); }} className="rounded-full border border-white/14 bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.13]">Talk to URAI</button>
            <Link href="/settings/privacy" className="rounded-full border border-emerald-200/20 bg-emerald-300/[0.08] px-6 py-3 text-sm font-semibold text-emerald-50 backdrop-blur-xl transition hover:bg-emerald-300/[0.13]">Privacy Controls</Link>
          </div>

          <p className="mt-7 max-w-xl text-sm leading-6 text-white/52">Private by default. You control what is captured, exported, or deleted.</p>
        </section>
      </main>

      <OrbChatDrawer
        open={orbOpen}
        onClose={() => setOrbOpen(false)}
        context={{
          todayMoodState: mode === "bloom" ? "recovering" : mode === "memory" ? "reflective" : "quiet and awake",
          mentalLoadScore: 0.42,
          rhythmState: mode,
          lastNarratorInsight: "Your home world is alive: sky, ground, orb, and companion are ready.",
          recentTimelineEvents: ["Home opened", "Orb ready", "Memory Galaxy available"],
          relationshipSignals: ["private by default", "user controlled"],
          userTonePreference: "direct",
        }}
      />
    </>
  );
}
