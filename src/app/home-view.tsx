"use client";

import React, { useState } from "react";
import Link from "next/link";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";

const starPoints = [
  ["9%", "24%", "2px"],
  ["19%", "50%", "3px"],
  ["33%", "18%", "2px"],
  ["68%", "16%", "2px"],
  ["82%", "31%", "3px"],
  ["91%", "58%", "2px"],
  ["48%", "12%", "2px"],
  ["57%", "68%", "2px"],
];

export default function HomeView(): React.ReactElement {
  const [orbOpen, setOrbOpen] = useState(false);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#02040b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(186,230,253,0.28),transparent_24%),radial-gradient(circle_at_21%_70%,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_78%_43%,rgba(168,85,247,0.16),transparent_26%),linear-gradient(180deg,#02040b_0%,#061626_48%,#03120d_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.72),transparent_24%,transparent_76%,rgba(0,0,0,.62)),linear-gradient(180deg,rgba(0,0,0,.28),transparent_46%,rgba(0,0,0,.66))]" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {starPoints.map(([left, top, size], index) => (
            <span key={index} className="absolute rounded-full bg-cyan-100/65 shadow-[0_0_18px_rgba(186,230,253,.75)]" style={{ left, top, width: size, height: size }} />
          ))}
          <div className="absolute left-1/2 top-[30%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-cyan-100/10" />
          <div className="absolute left-1/2 top-[33%] h-[27rem] w-[48rem] -translate-x-1/2 rounded-[50%] border border-cyan-100/10" />
          <div className="absolute left-1/2 top-[41%] h-[18rem] w-[62rem] -translate-x-1/2 rounded-[50%] border border-cyan-100/8" />
          <div className="absolute inset-x-[-8%] bottom-[-18%] h-[36%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,.35),rgba(15,23,42,.88)_58%,rgba(2,6,23,1)_78%)] blur-sm" />
          <div className="absolute left-1/2 top-[68%] h-48 w-[58rem] -translate-x-1/2 rounded-[50%] bg-cyan-200/10 blur-3xl" />
        </div>

        <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.52em] text-cyan-100/60">URAI</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-black tracking-[-0.075em] text-white md:text-7xl">Your inner world is awake</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 md:text-lg">A private emotional universe for memory, recovery, reflection, and the quiet patterns that shape your life.</p>

          <div className="relative mt-12 h-[25rem] w-[min(25rem,78vw)]">
            <div className="absolute inset-0 rounded-full bg-cyan-200/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 bg-[radial-gradient(circle_at_36%_28%,rgba(255,255,255,.96),rgba(165,243,252,.58)_18%,rgba(8,47,73,.62)_45%,rgba(2,6,23,.96)_73%)] shadow-[0_0_120px_rgba(125,211,252,.34)]" />
            <div className="absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,.75),rgba(125,211,252,.32)_32%,rgba(15,23,42,.34)_70%)] backdrop-blur-md" />
            <button type="button" aria-label="Open URAI orb" onClick={() => setOrbOpen(true)} className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-100/40 bg-cyan-200/15 text-xs font-semibold uppercase tracking-[0.34em] text-white shadow-[0_0_70px_rgba(186,230,253,.42)] backdrop-blur-xl transition hover:scale-105">Orb</button>

            <div className="absolute left-[4%] top-[44%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Memory</div>
            <div className="absolute right-[3%] top-[38%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Recovery</div>
            <div className="absolute bottom-[16%] left-[18%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Shadow</div>
            <div className="absolute bottom-[18%] right-[18%] rounded-full border border-cyan-100/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50/55">Joy</div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/life-map" className="rounded-full bg-cyan-100 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_36px_rgba(186,230,253,.22)] transition hover:scale-[1.02]">Enter Memory Galaxy</Link>
            <button type="button" onClick={() => setOrbOpen(true)} className="rounded-full border border-white/14 bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.13]">Talk to URAI</button>
            <Link href="/settings/privacy" className="rounded-full border border-emerald-200/20 bg-emerald-300/[0.08] px-6 py-3 text-sm font-semibold text-emerald-50 backdrop-blur-xl transition hover:bg-emerald-300/[0.13]">Privacy Controls</Link>
          </div>

          <p className="mt-7 max-w-xl text-sm leading-6 text-white/52">Private by default. You control what is captured, exported, or deleted.</p>
        </section>
      </main>

      <OrbChatDrawer
        open={orbOpen}
        onClose={() => setOrbOpen(false)}
        context={{
          todayMoodState: "quiet and awake",
          mentalLoadScore: 0.42,
          rhythmState: "settling",
          lastNarratorInsight: "Your world is open. Start with one memory, or simply enter quietly.",
          recentTimelineEvents: ["Home opened", "Orb ready", "Memory Galaxy available"],
          relationshipSignals: ["private by default", "user controlled"],
          userTonePreference: "direct",
        }}
      />
    </>
  );
}
