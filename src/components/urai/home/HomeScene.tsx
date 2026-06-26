"use client";

import { useEffect, useState } from "react";
import { GenesisSceneShell } from "@/components/urai/GenesisSceneShell";

type HomeSceneProps = {
  ascentTarget?: string;
};

export function HomeScene(_props: HomeSceneProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050714] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(110,196,255,0.28),transparent_30%),radial-gradient(circle_at_50%_72%,rgba(45,212,191,0.14),transparent_34%),linear-gradient(145deg,#07101f_0%,#050714_52%,#02030a_100%)]" />
        <section className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/70">URAI Genesis</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
              Preparing the Life Map.
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
              Loading the launch-safe cinematic shell. Private data, generated media, and provider-backed systems remain gated until proven.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return <GenesisSceneShell />;
}
