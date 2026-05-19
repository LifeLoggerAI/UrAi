import Link from "next/link";
import { resolveUraiFeatureFlags } from "@/lib/urai-canon/feature-flags";
import { reduceUraiFocusSessionState, reduceUraiReplayState } from "@/lib/urai-canon/state-machines";

type TierTwoInteractionPanelProps = {
  selectedStarId?: string;
  sessionId?: string;
  replayId?: string;
  view: string;
};

const starStates = [
  { id: "starter-star", label: "Starter Star", state: "unlocked", privacy: "private", relation: "current focus" },
  { id: "vaulted-origin", label: "Vaulted Origin", state: "vault", privacy: "vaulted", relation: "protected memory" },
  { id: "archived-arc", label: "Archived Arc", state: "archived", privacy: "archived", relation: "completed chapter" },
];

export default function TierTwoInteractionPanel({ selectedStarId, sessionId, replayId, view }: TierTwoInteractionPanelProps) {
  const flags = resolveUraiFeatureFlags();
  const chosenStar = starStates.find((star) => star.id === selectedStarId) ?? starStates[0];
  const focusState = reduceUraiFocusSessionState(reduceUraiFocusSessionState(reduceUraiFocusSessionState("idle", "CHOOSE_INTENT"), "CLARIFY_NEXT_ACTION"), sessionId ? "START" : "CHOOSE_INTENT");
  const replayState = replayId
    ? reduceUraiReplayState(reduceUraiReplayState(reduceUraiReplayState("library", "SELECT_REPLAY"), "CHOOSE_SOURCES"), "PREVIEW_SENSITIVE_CONTENT")
    : "library";

  if (!flags.lifeMapTier2) {
    return (
      <aside className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300" data-tier-two-panel="fallback">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">Tier 2 disabled</p>
        <p className="mt-2">Personalized star previews, related rails, focus suggestions, and replay chapters are hidden. Tier 1 routes remain direct-load safe.</p>
      </aside>
    );
  }

  return (
    <aside className="mt-6 grid gap-4 lg:grid-cols-2" data-tier-two-panel="active">
      <section className="rounded-[1.5rem] border border-cyan-100/10 bg-cyan-100/[0.035] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">Star preview</p>
        <h2 className="mt-2 text-lg font-semibold text-white">{chosenStar.label}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">State: {chosenStar.state} · Privacy: {chosenStar.privacy} · Relation: {chosenStar.relation}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-cyan-100/70">
          <span className="rounded-full border border-cyan-100/15 px-3 py-2">Preview tooltip</span>
          <span className="rounded-full border border-cyan-100/15 px-3 py-2">Detail panel</span>
          <span className="rounded-full border border-cyan-100/15 px-3 py-2">Related rail</span>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-100/60">Filters and privacy</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-200">
          {['all', 'unlocked', 'private', 'vault', 'archived', 'deleted-safe'].map((filter) => (
            <span key={filter} className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-center">{filter}</span>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-amber-100/10 bg-amber-100/[0.035] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/60">Focus state</p>
        <p className="mt-2 text-sm text-slate-200">Session: {sessionId ?? "manual setup"}</p>
        <p className="mt-1 text-sm text-slate-200">State machine: <span className="font-mono text-amber-100">{focusState}</span></p>
        <p className="mt-3 text-sm leading-6 text-slate-300">Suggested intent: protect one meaningful next action, recover without shame, then reflect briefly.</p>
      </section>

      <section className="rounded-[1.5rem] border border-violet-100/10 bg-violet-100/[0.035] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-100/60">Replay state</p>
        <p className="mt-2 text-sm text-slate-200">Replay: {replayId ?? "library"}</p>
        <p className="mt-1 text-sm text-slate-200">State machine: <span className="font-mono text-violet-100">{replayState}</span></p>
        <p className="mt-3 text-sm leading-6 text-slate-300">Chapters stay source-backed. Sensitive preview and correction gates are required before playback claims truth.</p>
      </section>

      <nav className="lg:col-span-2 flex flex-wrap gap-3" aria-label="Tier 2 critical flow links">
        <Link href="/life-map/star/starter-star" className="rounded-full border border-cyan-100/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Star detail</Link>
        <Link href="/focus/session/starter-session" className="rounded-full border border-amber-100/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">Start focus</Link>
        <Link href="/replay/starter-replay" className="rounded-full border border-violet-100/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">Open replay</Link>
        <Link href={view === "lifeMap" ? "/home" : "/life-map"} className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Unwind</Link>
      </nav>
    </aside>
  );
}
