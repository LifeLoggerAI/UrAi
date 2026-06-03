"use client";

import { useEffect, useRef } from "react";
import { useUraiAudio } from "@/providers/UraiAudioProvider";

type GenesisMoodState = "calm" | "heavy" | "focused" | "anxious" | "hopeful" | "recovering" | "shadow" | "threshold" | "luminous";

type UseGenesisSoundscapeOptions = {
  moodState?: GenesisMoodState;
  enabled?: boolean;
  sceneActive?: boolean;
};

const moodAudioMap: Record<GenesisMoodState, string> = {
  calm: "calm-bed",
  heavy: "heavy-bed",
  focused: "focused-bed",
  anxious: "anxious-bed",
  hopeful: "hopeful-bed",
  recovering: "recovering-bed",
  shadow: "shadow-bed",
  threshold: "threshold-bed",
  luminous: "luminous-bed",
};

const ambientLoopMap: Record<GenesisMoodState, string> = {
  calm: "sky-calm-loop",
  heavy: "sky-night-loop",
  focused: "sky-soft-wind-loop",
  anxious: "sky-soft-wind-loop",
  hopeful: "sky-calm-loop",
  recovering: "sky-calm-loop",
  shadow: "sky-night-loop",
  threshold: "sky-soft-wind-loop",
  luminous: "sky-calm-loop",
};

export function useGenesisSoundscape({ moodState = "luminous", enabled = true, sceneActive = true }: UseGenesisSoundscapeOptions): void {
  const audio = useUraiAudio();
  const previousMoodLoop = useRef<string | null>(null);
  const previousAmbientLoop = useRef<string | null>(null);

  useEffect(() => {
    if (!sceneActive || !enabled || !audio.settings.enabled || !audio.isUnlocked) return;

    if (audio.settings.reducedSensoryMode) {
      void audio.stopLoop(previousMoodLoop.current ?? moodAudioMap[moodState], { fadeMs: 900 });
      void audio.stopLoop("orb-hum-loop", { fadeMs: 900 });
      return;
    }

    const nextAmbientLoop = ambientLoopMap[moodState];
    const previousAmbient = previousAmbientLoop.current;
    if (previousAmbient && previousAmbient !== nextAmbientLoop) {
      void audio.crossfadeMood(previousAmbient, nextAmbientLoop, { durationMs: 2200, toVolume: 0.2 });
    } else if (!previousAmbient) {
      void audio.playLoop(nextAmbientLoop, { category: "ambient", volume: 0.22, fadeMs: 1800 });
    }
    previousAmbientLoop.current = nextAmbientLoop;

    void audio.playLoop("orb-hum-loop", { category: "orb", volume: 0.12, fadeMs: 1800 });

    return () => {
      void audio.stopLoop(nextAmbientLoop, { fadeMs: 1400 });
      void audio.stopLoop("orb-hum-loop", { fadeMs: 1200 });
    };
  }, [audio, audio.isUnlocked, audio.settings.enabled, audio.settings.reducedSensoryMode, enabled, moodState, sceneActive]);

  useEffect(() => {
    if (!sceneActive || !enabled || !audio.settings.enabled || !audio.isUnlocked) return;
    if (audio.settings.reducedSensoryMode) return;

    const nextMoodLoop = moodAudioMap[moodState];
    const previous = previousMoodLoop.current;

    if (previous && previous !== nextMoodLoop) {
      void audio.crossfadeMood(previous, nextMoodLoop, { durationMs: 2400, toVolume: 0.12 });
    } else if (!previous) {
      void audio.playLoop(nextMoodLoop, { category: "mood", volume: 0.12, fadeMs: 2000 });
    }

    previousMoodLoop.current = nextMoodLoop;

    return () => {
      void audio.stopLoop(nextMoodLoop, { fadeMs: 1400 });
    };
  }, [audio, audio.isUnlocked, audio.settings.enabled, audio.settings.reducedSensoryMode, enabled, moodState, sceneActive]);
}
