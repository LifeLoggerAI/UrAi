"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { UraiCinematicData } from "./types";
import { cameraPhases } from "./camera-machine";
import { useNarratorSync } from "./use-narrator-sync";
import { useReplayTimeline } from "./use-replay-timeline";
import { useUraiCinematicController } from "./use-urai-cinematic-controller";

export default function UraiProductionClient({ entry, data }: { entry: "home" | "lifeMap" | "replay"; data: UraiCinematicData }) {
  const reduceMotion = useReducedMotion();
  const directReplayStartedRef = useRef(false);
  const initialPhase = entry === "home" ? "idle" : "lifeMap";
  const cinematic = useUraiCinematicController(initialPhase);
  const replay = useReplayTimeline({ beats: data.replayBeats, isPlaying: cinematic.phase === "replaying", initialProgressMs: data.replayEra.progressMs ?? 0, onComplete: cinematic.exitReplay });
  const selectedStar = useMemo(() => data.stars.find((star) => star.id === cinematic.selectedStarId) ?? null, [data.stars, cinematic.selectedStarId]);
  const cue = useMemo(() => {
    if (replay.activeBeat?.narratorCueId) return data.narratorCues.find((item) => item.id === replay.activeBeat?.narratorCueId) ?? null;
    if (selectedStar?.narratorCueId) return data.narratorCues.find((item) => item.id === selectedStar.narratorCueId) ?? null;
    if (cinematic.phase === "preAscent" || cinematic.phase === "ascending") return data.narratorCues.find((item) => item.id === "cue-ascent") ?? null;
    return null;
  }, [cinematic.phase, data.narratorCues, replay.activeBeat, selectedStar]);
  const narrator = useNarratorSync({ phase: cinematic.phase, cue, ttsEnabled: !reduceMotion });
  const phase = cameraPhases[cinematic.phase];
  const transform = phase.transform;

  useEffect(() => {
    if (entry !== "replay") return undefined;
    if (directReplayStartedRef.current) return undefined;
    if (cinematic.phase !== "lifeMap") return undefined;
    directReplayStartedRef.current = true;
    const timer = window.setTimeout(() => cinematic.beginReplay(data.replayEra), 140);
    return () => window.clearTimeout(timer);
  }, [cinematic, data.replayEra, entry]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cinematic.handleBackIntent();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cinematic]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-slate-950 text-white" data-urai-production-entry={entry} data-urai-phase={cinematic.phase}>
      <motion.section className="absolute inset-0" animate={reduceMotion ? { opacity: 1 } : { scale: transform.scale, x: transform.x, y: -transform.y, filter: `blur(${transform.blur}px)` }} transition={{ duration: reduceMotion ? 0.12 : phase.durationMs / 1000, ease: phase.easing }}>
        <div className="absolute inset-0" style={{ background: replay.activeBeat?.emotionalWeatherState.skyGradient ?? selectedStar?.weatherContext?.skyGradient ?? data.stars[0]?.weatherContext?.skyGradient }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.16),transparent_28%),linear-gradient(180deg,transparent,rgba(0,0,0,.7))]" />
        <button type="button" aria-label="Begin URAI Ascent" onClick={cinematic.beginAscent} disabled={cinematic.phase !== "idle" || cinematic.interactionLocked} className="absolute inset-0 z-10 disabled:cursor-default" />
        <div className="absolute inset-x-0 bottom-0 z-20 h-[32svh] bg-gradient-to-t from-black via-emerald-950/20 to-transparent opacity-90" />
        <div className="absolute left-1/2 top-[54%] z-30 h-64 w-36 -translate-x-1/2 rounded-full bg-cyan-100/10 blur-sm" />
        <div className="absolute inset-0 z-40">
          {data.stars.map((star) => {
            const isSelected = star.id === cinematic.selectedStarId;
            const dimmed = cinematic.selectedStarId && !isSelected;
            return <button key={star.id} type="button" aria-label={`Open Memory Star: ${star.title}`} onClick={() => cinematic.focusStar(star)} disabled={cinematic.interactionLocked || cinematic.phase === "idle"} className="absolute min-h-11 min-w-11 rounded-full disabled:pointer-events-none" style={{ left: `${star.x}%`, top: `${star.y}%`, opacity: dimmed ? 0.22 : 1 }}><span className="block rounded-full" style={{ width: 10 + star.intensity * 14, height: 10 + star.intensity * 14, background: star.auraColor, boxShadow: `0 0 ${20 + star.intensity * 40}px ${star.auraColor}`, transform: isSelected ? "scale(1.7)" : "scale(1)" }} /></button>;
          })}
        </div>
      </motion.section>
      {cinematic.phase === "idle" && <section className="absolute inset-x-4 bottom-14 z-50 mx-auto max-w-2xl text-center"><p className="text-xs uppercase tracking-[.35em] text-white/45">URAI</p><h1 className="mt-3 text-4xl font-semibold md:text-6xl">Your symbolic life map is forming.</h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/65">Tap the sky to begin Ascent into your Memory Stars, Timeline Constellation, and Replay Era.</p></section>}
      {cinematic.phase === "lifeMap" && <nav className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-3 rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur-xl"><button type="button" onClick={() => cinematic.beginReplay(data.replayEra)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Replay Era</button><button type="button" onClick={cinematic.returnHome} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80">Return Home</button></nav>}
      {cinematic.phase === "focusedMemory" && selectedStar && <aside role="dialog" aria-label={`Memory Bloom: ${selectedStar.title}`} className="absolute inset-x-4 bottom-5 z-50 mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl"><button type="button" onClick={cinematic.returnToLifeMap} className="mb-4 rounded-full border border-white/15 px-4 py-2 text-sm">Back to Symbolic Life Map</button><h2 className="text-3xl font-semibold">{selectedStar.title}</h2><p className="mt-3 text-sm leading-6 text-white/65">{selectedStar.sourceSignals.join(", ")} · {selectedStar.symbolicTags.join(", ")}</p><button type="button" onClick={() => cinematic.beginReplay(data.replayEra)} className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Replay Era</button></aside>}
      {(cinematic.phase === "replaying" || cinematic.phase === "replayPaused") && <div className="absolute inset-x-3 bottom-4 z-50 mx-auto max-w-3xl rounded-[1.75rem] border border-white/10 bg-black/50 p-3 backdrop-blur-xl"><div className="flex items-center gap-3"><button type="button" onClick={replay.rewind} className="rounded-full border border-white/15 px-3 py-2 text-sm">-5s</button><button type="button" onClick={cinematic.phase === "replayPaused" ? cinematic.resumeReplay : cinematic.pauseReplay} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">{cinematic.phase === "replayPaused" ? "Play" : "Pause"}</button><input aria-label="Replay timeline scrubber" type="range" min={0} max={1000} value={Math.round(replay.progressPercent * 1000)} onChange={(event) => replay.scrubTo((Number(event.target.value) / 1000) * replay.totalDurationMs)} className="flex-1 accent-white" /><button type="button" onClick={replay.fastForward} className="rounded-full border border-white/15 px-3 py-2 text-sm">+5s</button><button type="button" onClick={cinematic.exitReplay} className="rounded-full border border-white/15 px-4 py-2 text-sm">Exit</button></div></div>}
      {narrator.activeCueText && <div className="absolute left-4 right-4 top-5 z-50 mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/50 p-4 text-center text-sm leading-6 text-white shadow-2xl backdrop-blur-xl" aria-live="polite">{narrator.activeCueText}</div>}
    </main>
  );
}
