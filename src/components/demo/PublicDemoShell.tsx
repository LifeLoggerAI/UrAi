"use client";

import { useState } from "react";
import { GenesisSceneShell } from "@/components/urai/GenesisSceneShell";
import { DemoModeBadge } from "./DemoModeBadge";
import { WaitlistCapture } from "@/components/launch/WaitlistCapture";
import { useUraiDemo } from "@/providers/UraiDemoProvider";

export function PublicDemoShell({ founder = false }: { founder?: boolean }) {
  const [entered, setEntered] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const demo = useUraiDemo();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <DemoModeBadge />
      <GenesisSceneShell />
      {!entered ? (
        <section className="absolute inset-0 z-[80] grid place-items-center bg-black/42 p-5 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-black/48 p-6 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/42">{founder ? "Founder Demo" : "Public Demo"}</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight">{demo.demoProfile.title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/68">A private, symbolic life interface where your sky, Ground, Mirror, and Companion respond only to the layers you choose to open.</p>
            <p className="mt-3 text-xs text-white/48">This demo uses sample data.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={() => setEntered(true)} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Enter demo</button>
              <button onClick={() => setShowWaitlist(true)} className="rounded-full bg-white/[0.08] px-5 py-3 text-sm text-white/76">Join waitlist</button>
              <a href="/launch" className="rounded-full bg-white/[0.06] px-5 py-3 text-sm text-white/60">Learn About URAI</a>
            </div>
          </div>
        </section>
      ) : null}
      {showWaitlist ? (
        <div className="absolute inset-0 z-[100] grid place-items-center bg-black/60 p-5 backdrop-blur-lg">
          <div className="w-full max-w-md">
            <WaitlistCapture source={founder ? "founder_demo" : "public_demo"} />
            <button onClick={() => setShowWaitlist(false)} className="mt-3 w-full rounded-full bg-white/[0.08] px-5 py-3 text-sm text-white/70">Return to demo</button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
