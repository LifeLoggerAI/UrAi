"use client";

import Link from "next/link";
import TierTwoInteractionPanel from "@/components/life-map/TierTwoInteractionPanel";
import { resolveUraiFeatureFlags } from "@/lib/urai-canon/feature-flags";
import { reduceUraiRouteMachine, type UraiRouteMachineSnapshot } from "@/lib/urai-canon/state-machines";
import {
  URAI_ARTIFACTS,
  URAI_PROGRESSION_PATHS,
  URAI_REPLAY_JOURNEYS,
  URAI_TIER_3_4_PERFORMANCE_BUDGETS,
  groupStarsByConstellation,
  resolveDenseMapLod,
  visibleConstellationStars,
} from "@/lib/urai-canon/tier-three-four";

type LifeMapUniverseProps = {
  initialOverlay?: string;
  initialView?: string;
  selectedStarId?: string;
  sessionId?: string;
  replayId?: string;
  routeNotice?: string;
};

type ViewMode = "lifeMap" | "focus" | "replay" | "mirror" | "bloom";

const overlayCopy: Record<string, { title: string; eyebrow: string; body: string; stage: string }> = {
  mirror: {
    eyebrow: "Cognitive mirror",
    title: "Mirror of becoming",
    body: "A symbolic mirror for memory, mood, and meaning.",
    stage: "the mirror reflects only sourced signals",
  },
  focus: {
    eyebrow: "Focus chamber",
    title: "One star, held clearly",
    body: "The selected star becomes a protected focus chamber: one intention, one next action, one quiet field.",
    stage: "focus chamber sealed around selected star",
  },
  replay: {
    eyebrow: "Replay theater",
    title: "Source-backed memory corridor",
    body: "The focus object opens into a private replay corridor with evidence, chapters, review, and redaction control.",
    stage: "memory theater open with evidence rail",
  },
  bloom: {
    eyebrow: "Memory bloom",
    title: "A living bloom of memory",
    body: "A stable bloom-level navigation shell.",
    stage: "memory bloom active",
  },
  lifeMap: {
    eyebrow: "Spatial life map",
    title: "Life map universe",
    body: "A premium spatial shell for constellations, chapters, rituals, and emotional weather.",
    stage: "constellation field ready",
  },
};

function contextLine({ selectedStarId, sessionId, replayId }: LifeMapUniverseProps) {
  if (selectedStarId) return `Selected star: ${selectedStarId}`;
  if (sessionId) return `Focus session: ${sessionId}`;
  if (replayId) return `Replay: ${replayId}`;
  return "Life map galaxy ready";
}

function routeSnapshotFor(props: LifeMapUniverseProps): UraiRouteMachineSnapshot {
  if (props.selectedStarId) return reduceUraiRouteMachine({ state: "life-map", route: "/life-map" }, { type: "SELECT_STAR", starId: props.selectedStarId });
  if (props.sessionId) return reduceUraiRouteMachine({ state: "focus-setup", route: "/focus" }, { type: "OPEN_FOCUS_SESSION", sessionId: props.sessionId });
  if (props.replayId) return reduceUraiRouteMachine({ state: "replay-library", route: "/replay" }, { type: "OPEN_REPLAY_DETAIL", replayId: props.replayId });
  if ((props.initialOverlay ?? props.initialView) === "focus") return reduceUraiRouteMachine({ state: "life-map", route: "/life-map" }, { type: "OPEN_FOCUS" });
  if ((props.initialOverlay ?? props.initialView) === "replay") return reduceUraiRouteMachine({ state: "focus-setup", route: "/focus" }, { type: "OPEN_REPLAY" });
  return reduceUraiRouteMachine({ state: "home", route: "/" }, { type: "OPEN_LIFE_MAP" });
}

function TierThreeConstellationLayer() {
  const visibleStars = visibleConstellationStars();
  const grouped = groupStarsByConstellation(visibleStars);
  const lod = resolveDenseMapLod(visibleStars.length, "desktop");

  return (
    <section className="rounded-[1.5rem] border border-cyan-100/10 bg-cyan-100/[0.035] p-4" data-tier-three-layer="active">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">Tier 3 constellation layer</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Constellation model · progression paths · dense-map LOD</h2>
        </div>
        <span className="rounded-full border border-cyan-100/15 px-3 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-cyan-100/70">LOD: {lod}</span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {grouped.map((constellation) => (
          <article key={constellation.id} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">{constellation.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{constellation.description}</p>
            <p className="mt-3 text-xs text-cyan-100/70">Visible stars: {constellation.stars.length}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {URAI_PROGRESSION_PATHS.map((path) => (
          <article key={path.id} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-violet-100/60">Progression path</p>
            <h3 className="mt-2 text-sm font-semibold text-white">{path.label}</h3>
            <p className="mt-2 text-xs text-slate-300">{path.starIds.length} stars · {path.status}</p>
          </article>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">Hidden and deleted stars are excluded before layout. Vaulted stars remain locked and only appear as protected metadata, never as replay evidence or AI truth.</p>
    </section>
  );
}

function TierFourJourneyLayer() {
  return (
    <section className="rounded-[1.5rem] border border-violet-100/10 bg-violet-100/[0.035] p-4" data-tier-four-layer="active">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-100/60">Tier 4 replay journey and artifact layer</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {URAI_REPLAY_JOURNEYS.map((journey) => (
          <article key={journey.id} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
            <h2 className="text-base font-semibold text-white">{journey.label}</h2>
            <p className="mt-2 text-sm text-slate-300">Replay: {journey.replayId}</p>
            <p className="mt-1 text-sm text-slate-300">Policy: {journey.evidencePolicy} · export {journey.exportPolicy}</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-200">
              {journey.chapters.map((chapter) => <li key={chapter}>• {chapter}</li>)}
            </ol>
          </article>
        ))}
        <article className="rounded-[1.25rem] border border-amber-100/10 bg-amber-100/[0.035] p-4">
          <h2 className="text-base font-semibold text-white">Artifact unlock review</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {URAI_ARTIFACTS.map((artifact) => (
              <p key={artifact.id}>{artifact.label}: {artifact.unlockState} · redaction {artifact.redactionRequired ? "required" : "clear"}</p>
            ))}
          </div>
        </article>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">Export/share stays opt-in and review-gated. Deletion must remove replay derivatives and artifact unlock state before any public surface can reference them.</p>
    </section>
  );
}

function OrbitalStage({ mode, context }: { mode: ViewMode; context: string }) {
  const isFocus = mode === "focus";
  const isReplay = mode === "replay";

  return (
    <section className="relative min-h-[34rem] overflow-hidden rounded-[2.75rem] border border-white/10 bg-black/35 shadow-[0_0_110px_rgba(14,165,233,.16)]" aria-label="URAI spatial stage">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(125,211,252,.20),transparent_26%),radial-gradient(circle_at_72%_18%,rgba(168,85,247,.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,.18),rgba(2,6,23,.86))]" />
      <div className="absolute inset-x-[-10%] top-[42%] h-24 rotate-[-2deg] bg-cyan-200/10 blur-2xl" />
      <div className="absolute inset-x-[-15%] top-[55%] h-28 rotate-[2deg] bg-blue-500/10 blur-2xl" />
      <div className="absolute bottom-[-8rem] left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-[100%] border border-cyan-100/10 bg-cyan-100/[0.035] blur-sm" />

      <div className="absolute left-[14%] top-[18%] h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_22px_rgba(186,230,253,.9)]" />
      <div className="absolute right-[17%] top-[22%] h-2.5 w-2.5 rounded-full bg-violet-100 shadow-[0_0_24px_rgba(221,214,254,.85)]" />
      <div className="absolute right-[31%] bottom-[25%] h-2 w-2 rounded-full bg-amber-100 shadow-[0_0_24px_rgba(254,240,138,.75)]" />
      <div className="absolute left-[26%] bottom-[32%] h-1.5 w-1.5 rounded-full bg-cyan-100/80 shadow-[0_0_18px_rgba(186,230,253,.65)]" />
      <div className="absolute left-[20%] top-[24%] h-px w-[28%] rotate-[14deg] bg-gradient-to-r from-transparent via-cyan-100/16 to-transparent" />
      <div className="absolute right-[17%] top-[27%] h-px w-[30%] rotate-[-19deg] bg-gradient-to-r from-transparent via-violet-100/16 to-transparent" />

      <div className="absolute left-1/2 top-[39%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10" />
      <div className="absolute left-1/2 top-[39%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/10" />
      <div className="absolute left-1/2 top-[39%] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

      <div className="absolute left-1/2 top-[40%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className={`${isReplay ? "h-48 w-72 rounded-[2rem]" : isFocus ? "h-56 w-56 rounded-full" : "h-64 w-64 rounded-full"} relative border border-cyan-100/30 bg-[radial-gradient(circle_at_32%_25%,#ffffff,rgba(165,243,252,.76)_18%,rgba(8,47,73,.78)_45%,rgba(2,6,23,.95)_72%)] shadow-[0_0_95px_rgba(103,232,249,.34)]`}>
          <div className="absolute inset-[11%] rounded-[inherit] border border-white/10" />
          <div className="absolute -inset-10 rounded-[inherit] border border-cyan-100/10 blur-[1px]" />
          {isReplay ? (
            <div className="absolute inset-5 rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[0.6rem] uppercase tracking-[0.24em] text-cyan-100/70">Replay evidence</p>
              <div className="mt-12 h-1 rounded-full bg-cyan-100/20"><div className="h-full w-2/3 rounded-full bg-cyan-100/70" /></div>
              <div className="mt-4 grid grid-cols-4 gap-2">{[0, 1, 2, 3].map((i) => <span key={i} className="h-8 rounded-lg border border-white/10 bg-white/5" />)}</div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute left-8 top-8 rounded-full border border-cyan-100/15 bg-slate-950/45 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-cyan-100/75 backdrop-blur-xl">
        {isReplay ? "Replay chamber" : isFocus ? "Focus chamber" : "Life map galaxy"}
      </div>
      <div className="absolute bottom-8 left-8 right-8 grid gap-3 md:grid-cols-3">
        {[
          ["Route", context],
          ["Motion", isReplay ? "evidence-led slow theater" : isFocus ? "sealed chamber, low motion" : "orbital map drift"],
          ["Privacy", "visible metadata only"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-cyan-100/55">{label}</p>
            <p className="mt-2 text-sm text-slate-100">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LifeMapUniverse(props: LifeMapUniverseProps) {
  const flags = resolveUraiFeatureFlags();
  const routeSnapshot = routeSnapshotFor(props);
  const requestedView = (props.initialOverlay ?? props.initialView ?? "lifeMap") as ViewMode;
  const active = overlayCopy[requestedView] ?? overlayCopy.lifeMap;
  const restoredContext = contextLine(props);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white" data-route-state={routeSnapshot.state} data-tier-one={String(flags.lifeMapTier1)} data-tier-two={String(flags.lifeMapTier2)} data-tier-three={String(flags.lifeMapTier3)} data-tier-four={String(flags.lifeMapTier4)}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,.24),transparent_36%),radial-gradient(circle_at_82%_8%,rgba(88,28,135,.34),transparent_32%),linear-gradient(180deg,#050814_0%,#0b1028_42%,#030712_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_22%,rgba(255,255,255,.45)_0_1px,transparent_1.5px),radial-gradient(circle_at_76%_18%,rgba(186,230,253,.38)_0_1px,transparent_1.5px),radial-gradient(circle_at_58%_11%,rgba(221,214,254,.32)_0_1px,transparent_1.5px),radial-gradient(circle_at_41%_31%,rgba(255,255,255,.20)_0_1px,transparent_1.5px)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-56 bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,.13),transparent_64%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[88rem] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 mb-6 flex items-center justify-between rounded-full border border-white/10 bg-slate-950/45 p-2 backdrop-blur-2xl">
          <Link href="/" className="rounded-full border border-cyan-100/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100">URAI Life Map</Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">{flags.lifeMapTier4 ? "Tier 4 active" : flags.lifeMapTier3 ? "Tier 3 active" : flags.lifeMapTier2 ? "Tier 2 active" : "Tier 1 safe shell"}</span>
        </header>

        <div className="grid flex-1 items-stretch gap-6 lg:grid-cols-[minmax(20rem,29rem)_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-slate-950/62 p-5 shadow-[0_0_80px_rgba(14,165,233,.12)] backdrop-blur-2xl lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200/75">{active.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">{active.title}</h1>
            <p className="mt-4 text-base leading-7 text-slate-200/85">{active.body}</p>

            <div className="mt-5 rounded-[1.35rem] border border-cyan-100/10 bg-cyan-100/[0.035] p-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Canonical route state</p>
              <p className="mt-2">State: <span className="font-mono text-cyan-100">{routeSnapshot.state}</span></p>
              <p className="mt-1">Route: <span className="font-mono text-cyan-100">{routeSnapshot.route}</span></p>
              {routeSnapshot.notice ? <p className="mt-2 text-amber-100/90">{routeSnapshot.notice}</p> : null}
            </div>

            <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Route state restored</p>
              <p className="mt-2">{props.routeNotice ?? active.stage}</p>
              <p className="mt-2 font-mono text-cyan-100/80">{restoredContext}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[["Consent", "Owner-bound signals only"], ["Continuity", "Direct routes restore context"], ["Freeze", "Evidence required"]].map(([label, value]) => (
                <div key={label} className="rounded-[1.15rem] border border-cyan-100/10 bg-cyan-100/[0.04] p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-100/60">{label}</p>
                  <p className="mt-2 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>

            <TierTwoInteractionPanel selectedStarId={props.selectedStarId} sessionId={props.sessionId} replayId={props.replayId} view={requestedView} />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/life-map/star/starter-star" className="rounded-full border border-cyan-100/30 bg-cyan-100/10 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cyan-50 transition hover:border-cyan-100/60 hover:bg-cyan-100/15">Select Star</Link>
              <Link href="/focus/session/starter-session" className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/25 hover:text-white">Focus</Link>
              <Link href="/replay/starter-replay" className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/25 hover:text-white">Replay</Link>
            </div>
          </aside>

          <div className="space-y-6">
            <OrbitalStage mode={requestedView} context={restoredContext} />
            <div className="grid gap-6 xl:grid-cols-2">
              {flags.lifeMapTier3 ? <TierThreeConstellationLayer /> : null}
              {flags.lifeMapTier4 ? <TierFourJourneyLayer /> : null}
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300" data-performance-budget="tier-3-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Performance budgets</p>
              <p className="mt-2">Dense map {URAI_TIER_3_4_PERFORMANCE_BUDGETS.denseMapRenderMs}ms · constellation {URAI_TIER_3_4_PERFORMANCE_BUDGETS.constellationLayerRenderMs}ms · replay transition {URAI_TIER_3_4_PERFORMANCE_BUDGETS.replayJourneyTransitionMs}ms · mobile memory {URAI_TIER_3_4_PERFORMANCE_BUDGETS.mobileMemoryMb}MB.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
