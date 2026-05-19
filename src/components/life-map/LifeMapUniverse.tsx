"use client";

import Link from "next/link";

type LifeMapUniverseProps = {
  initialOverlay?: string;
  initialView?: string;
  selectedStarId?: string;
  sessionId?: string;
  replayId?: string;
  routeNotice?: string;
};

const overlayCopy: Record<string, { title: string; eyebrow: string; body: string }> = {
  mirror: {
    eyebrow: "Cognitive mirror",
    title: "Mirror of becoming",
    body: "A symbolic mirror for memory, mood, and meaning.",
  },
  focus: {
    eyebrow: "Focus chamber",
    title: "One star, held clearly",
    body: "A quiet focus shell for one selected star or restored session.",
  },
  replay: {
    eyebrow: "Replay theater",
    title: "Source-backed memory corridor",
    body: "A restrained replay shell for review, correction, and return.",
  },
  bloom: {
    eyebrow: "Memory bloom",
    title: "A living bloom of memory",
    body: "A stable bloom-level navigation shell.",
  },
  lifeMap: {
    eyebrow: "Spatial life map",
    title: "Life map universe",
    body: "A premium spatial shell for constellations, chapters, rituals, and emotional weather.",
  },
};

function contextLine({ selectedStarId, sessionId, replayId }: LifeMapUniverseProps) {
  if (selectedStarId) return `Selected star: ${selectedStarId}`;
  if (sessionId) return `Focus session: ${sessionId}`;
  if (replayId) return `Replay: ${replayId}`;
  return null;
}

export default function LifeMapUniverse(props: LifeMapUniverseProps) {
  const requestedView = props.initialOverlay ?? props.initialView ?? "lifeMap";
  const active = overlayCopy[requestedView] ?? overlayCopy.lifeMap;
  const restoredContext = contextLine(props);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#172554_0%,#020617_48%,#000_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(125,211,252,.14),transparent_34%,rgba(168,85,247,.12)_70%,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-16rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="mb-8 flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl">
          <Link href="/home" className="rounded-full border border-cyan-100/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100">
            URAI Life Map
          </Link>

          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
            Tier-gated shell
          </span>
        </header>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-[2.5rem] border border-white/10 bg-slate-950/55 p-8 shadow-[0_0_90px_rgba(14,165,233,.16)] backdrop-blur-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200/75">{active.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">{active.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/85">{active.body}</p>

            {restoredContext || props.routeNotice ? (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Route state restored</p>
                <p className="mt-2">{props.routeNotice ?? "Direct URL context recovered."}</p>
                {restoredContext ? <p className="mt-2 font-mono text-cyan-100/80">{restoredContext}</p> : null}
              </div>
            ) : null}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Consent", "Owner-bound signals only"],
                ["Continuity", "Direct routes restore context"],
                ["Freeze", "Evidence required"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-cyan-100/10 bg-cyan-100/[0.04] p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-100/60">{label}</p>
                  <p className="mt-2 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/life-map/star/starter-star" className="rounded-full border border-cyan-100/30 bg-cyan-100/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-50 transition hover:border-cyan-100/60 hover:bg-cyan-100/15">
                Select Starter Star
              </Link>
              <Link href="/focus/session/starter-session" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/25 hover:text-white">
                Focus Session
              </Link>
              <Link href="/replay/starter-replay" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-white/25 hover:text-white">
                Replay
              </Link>
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
                <p className="mt-3 text-sm leading-6 text-slate-200">Direct routes, route context, and shared shell continuity are wired into this launch-safe surface.</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
