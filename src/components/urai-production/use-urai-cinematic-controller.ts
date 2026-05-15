"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CameraPhase, MemoryStar, ReplayEra } from "./types";
import { cameraPhases, canTransition } from "./camera-machine";

type TimerId = ReturnType<typeof window.setTimeout>;

export function useUraiCinematicController(initialPhase: CameraPhase = "idle") {
  const [phase, setPhaseState] = useState<CameraPhase>(initialPhase);
  const [previousPhase, setPreviousPhase] = useState<CameraPhase | null>(null);
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [activeReplayEraId, setActiveReplayEraId] = useState<string | null>(null);
  const timersRef = useRef<TimerId[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const setPhase = useCallback((nextPhase: CameraPhase, force = false) => {
    setPhaseState((current) => {
      if (!force && !canTransition(current, nextPhase)) return current;
      setPreviousPhase(current);
      return nextPhase;
    });
  }, []);

  const beginAscent = useCallback(() => {
    if (phase !== "idle" || cameraPhases[phase].interactionLocked) return;
    clearTimers();
    setSelectedStarId(null);
    setActiveReplayEraId(null);
    setPhase("preAscent", true);

    const t1 = window.setTimeout(() => setPhase("ascending"), cameraPhases.preAscent.durationMs);
    const t2 = window.setTimeout(() => setPhase("lifeMap"), cameraPhases.preAscent.durationMs + cameraPhases.ascending.durationMs);
    timersRef.current = [t1, t2];
  }, [clearTimers, phase, setPhase]);

  const focusStar = useCallback((star: MemoryStar) => {
    if (cameraPhases[phase].interactionLocked) return;
    if (!["lifeMap", "replaying", "replayPaused"].includes(phase)) return;
    clearTimers();
    setSelectedStarId(star.id);
    setPhase("focusing", true);
    const timer = window.setTimeout(() => setPhase("focusedMemory"), cameraPhases.focusing.durationMs);
    timersRef.current = [timer];
  }, [clearTimers, phase, setPhase]);

  const returnToLifeMap = useCallback(() => {
    clearTimers();
    setSelectedStarId(null);
    setActiveReplayEraId(null);
    setPhase("lifeMap", true);
  }, [clearTimers, setPhase]);

  const beginReplay = useCallback((era: ReplayEra) => {
    if (!["lifeMap", "focusedMemory"].includes(phase)) return;
    clearTimers();
    setSelectedStarId(null);
    setActiveReplayEraId(era.id);
    setPhase("replayIntro", true);
    const timer = window.setTimeout(() => setPhase("replaying"), cameraPhases.replayIntro.durationMs);
    timersRef.current = [timer];
  }, [clearTimers, phase, setPhase]);

  const pauseReplay = useCallback(() => {
    if (phase === "replaying") setPhase("replayPaused");
  }, [phase, setPhase]);

  const resumeReplay = useCallback(() => {
    if (phase === "replayPaused") setPhase("replaying");
  }, [phase, setPhase]);

  const exitReplay = useCallback(() => {
    if (!["replayIntro", "replaying", "replayPaused"].includes(phase)) return;
    clearTimers();
    setPhase("replayExit", true);
    const timer = window.setTimeout(() => {
      setSelectedStarId(null);
      setActiveReplayEraId(null);
      setPhase("lifeMap", true);
    }, cameraPhases.replayExit.durationMs);
    timersRef.current = [timer];
  }, [clearTimers, phase, setPhase]);

  const returnHome = useCallback(() => {
    if (!["lifeMap", "focusedMemory"].includes(phase)) return;
    clearTimers();
    setPhase("returningHome", true);
    const timer = window.setTimeout(() => {
      setSelectedStarId(null);
      setActiveReplayEraId(null);
      setPhase("idle", true);
    }, cameraPhases.returningHome.durationMs);
    timersRef.current = [timer];
  }, [clearTimers, phase, setPhase]);

  const handleBackIntent = useCallback(() => {
    if (["focusedMemory", "focusing"].includes(phase)) returnToLifeMap();
    else if (["replayIntro", "replaying", "replayPaused"].includes(phase)) exitReplay();
    else if (phase === "lifeMap") returnHome();
  }, [exitReplay, phase, returnHome, returnToLifeMap]);

  useEffect(() => clearTimers, [clearTimers]);

  return {
    phase,
    previousPhase,
    selectedStarId,
    activeReplayEraId,
    interactionLocked: cameraPhases[phase].interactionLocked,
    setPhase,
    beginAscent,
    focusStar,
    returnToLifeMap,
    beginReplay,
    pauseReplay,
    resumeReplay,
    exitReplay,
    returnHome,
    handleBackIntent,
  };
}
