"use client";

import Link from "next/link";

type LifeMapUniverseProps = {
  initialOverlay?: string;
  initialView?: string;
};

const overlayCopy: Record<string, { title: string; eyebrow: string; body: string }> = {
  mirror: {
    eyebrow: "Cognitive mirror",
    title: "Mirror of becoming",
    body: "A symbolic mirror for memory, mood, and meaning. Production claims stay consent-gated until live evidence is verified.",
  },
  focus: {
    eyebrow: "Focus bloom",
    title: "One memory, held softly",
    body: "A low-noise view for one symbolic memory bloom with reduced-motion friendly presentation.",
  },
  replay: {
    eyebrow: "Replay path",
    title: "Memory replay corridor",
    body: "A cinematic but safe replay shell for reviewing moments without diagnostic claims.",
  },
  lifeMap: {
    eyebrow: "Spatial life map",
    title: "Life map universe",
    body: "A premium spatial shell for constellations, chapters, rituals, and emotional weather.",
  },
};

export default function LifeMapUniverse({ initialOverlay, initialView }: LifeMapUniverseProps) {
  const requestedView = initialOverlay ?? initialView ?? "lifeMap";
  const active = overlayCopy[requestedView] ?? overlayCopy.lifeMap;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#172554_0%,#020617_48%,#000_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(125,211,252,.14),transparent_34%,rgba(168,85,247,.12)_70%,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-16rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="mb-8 flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl">
          <Link href="/" className="rounded-full border border-cyan-100/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100">
            URAI Life Map
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
            Tier-gated shell
          </span>
        </header>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-[2.5rem] border border-white/10 bg-slate-950/55 p-8 shadow-[0_0_90px_rgba(14,165,233,.16)] backdrop-blur-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200/75">{active.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
              {active.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/85">{active.body}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Consent", "Owner-bound signals only"],
                ["Safety", "No diagnosis claims"],
                ["Freeze", "Evidence required"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-cyan-100/10 bg-cyan-100/[0.04] p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-100/60">{label}</p>
                  <p className="mt-2 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative min-h-[28rem] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-6 shadow-[0_0_90px_rgba(168,85,247,.14)]">
            <div className="absolute inset-8 rounded-full border border-cyan-100/15 bg-cyan-300/[0.03]" />
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/30 bg-cyan-100/10 shadow-[0_0_80px_rgba(125,211,252,.28)]" />
            <div className="absolute left-[18%] top-[22%] h-5 w-5 rounded-full bg-cyan-100 shadow-[0_0_30px_rgba(125,211,252,.8)]" />
            <div className="absolute right-[20%] top-[28%] h-4 w-4 rounded-full bg-violet-200 shadow-[0_0_30px_rgba(196,181,253,.8)]" />
            <div className="absolute bottom-[24%] left-[30%] h-3 w-3 rounded-full bg-amber-100 shadow-[0_0_30px_rgba(253,230,138,.75)]" />
            <div className="absolute bottom-[18%] right-[28%] h-4 w-4 rounded-full bg-emerald-100 shadow-[0_0_30px_rgba(167,243,208,.75)]" />
            <div className="relative z-10 flex h-full min-h-[24rem] items-end">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.26em] text-cyan-200/70">Production posture</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  This route compiles as a stable launch shell while deeper spatial/3D systems remain governed by Tier freeze evidence.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
