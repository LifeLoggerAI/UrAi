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

export function useGenesisSoundscape({ moodState = "luminous", enabled = true, sceneActive = true }: UseGenesisSoundscapeOptions): void {
  const audio = useUraiAudio();
  const previousMoodLoop = useRef<string | null>(null);

  useEffect(() => {
    if (!sceneActive || !enabled || !audio.settings.enabled || !audio.isUnlocked) return;
    if (audio.settings.reducedSensoryMode) return;

    void audio.playLoop("sky-calm-loop", { category: "ambient", volume: 0.28, fadeMs: 1800 });
    void audio.playLoop("orb-hum-loop", { category: "orb", volume: 0.16, fadeMs: 1800 });

    return () => {
      void audio.stopLoop("sky-calm-loop", { fadeMs: 1400 });
      void audio.stopLoop("orb-hum-loop", { fadeMs: 1200 });
    };
  }, [audio, audio.isUnlocked, audio.settings.enabled, audio.settings.reducedSensoryMode, enabled, sceneActive]);

  useEffect(() => {
    if (!sceneActive || !enabled || !audio.settings.enabled || !audio.isUnlocked) return;
    if (audio.settings.reducedSensoryMode) return;

    const nextMoodLoop = moodAudioMap[moodState];
    const previous = previousMoodLoop.current;

    if (previous && previous !== nextMoodLoop) {
      void audio.crossfadeMood(previous, nextMoodLoop, { durationMs: 2400, toVolume: 0.2 });
    } else if (!previous) {
      void audio.playLoop(nextMoodLoop, { category: "mood", volume: 0.18, fadeMs: 2000 });
    }

    previousMoodLoop.current = nextMoodLoop;

    return () => {
      void audio.stopLoop(nextMoodLoop, { fadeMs: 1400 });
    };
  }, [audio, audio.isUnlocked, audio.settings.enabled, audio.settings.reducedSensoryMode, enabled, moodState, sceneActive]);
}
