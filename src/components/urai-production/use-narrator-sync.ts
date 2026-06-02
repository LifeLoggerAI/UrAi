"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CameraPhase, NarratorCue } from "./types";
import { cameraPhases } from "./camera-machine";

export function useNarratorSync({
  phase,
  cue,
  ttsEnabled,
}: {
  phase: CameraPhase;
  cue: NarratorCue | null;
  ttsEnabled: boolean;
}) {
  const [activeCueText, setActiveCueText] = useState<string | null>(null);
  const delayRef = useRef<number | null>(null);
  const clearRef = useRef<number | null>(null);
  const lastCueRef = useRef<string | null>(null);

  const cancelNarration = useCallback(() => {
    if (delayRef.current) window.clearTimeout(delayRef.current);
    if (clearRef.current) window.clearTimeout(clearRef.current);
    delayRef.current = null;
    clearRef.current = null;
    setActiveCueText(null);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    cancelNarration();
    if (!cue) return;
    if (!cameraPhases[phase].narratorEligible) return;

    const cueKey = `${phase}:${cue.id}`;
    if (cueKey === lastCueRef.current && phase === "replaying") return;
    lastCueRef.current = cueKey;

    delayRef.current = window.setTimeout(() => {
      setActiveCueText(cue.text);
      if (ttsEnabled && cue.ttsEnabled && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(cue.text);
        utterance.rate = 0.92;
        utterance.pitch = cue.voiceTone === "bright" ? 1.08 : cue.voiceTone === "somber" ? 0.86 : 0.96;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
      clearRef.current = window.setTimeout(() => setActiveCueText(null), cue.durationMs);
    }, cue.delayMs);

    return cancelNarration;
  }, [cancelNarration, cue, phase, ttsEnabled]);

  return { activeCueText, cancelNarration };
}
