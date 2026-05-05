"use client";

import { useEffect, useMemo, useState } from "react";

export type EmotionalTone = "calm" | "focused" | "charged" | "restorative";

export type EmotionEngineInput = {
  mood?: string | null;
  stressScore?: number | null;
  rhythmScore?: number | null;
  recoveryScore?: number | null;
  focusScore?: number | null;
  updatedAt?: string | null;
};

const STORAGE_KEYS = [
  "urai:emotion-state",
  "urai:latest-emotion",
  "urai:mood-state",
  "urai:daily-state",
];

function clampScore(value: unknown): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(1, value));
}

function normalizeMood(mood: string | null | undefined) {
  return mood?.trim().toLowerCase() ?? "";
}

export function getFallbackTone(hour: number): EmotionalTone {
  if (hour < 6) return "restorative";
  if (hour < 12) return "focused";
  if (hour < 18) return "charged";
  return "calm";
}

export function resolveEmotionalTone(input: EmotionEngineInput, fallbackHour: number): EmotionalTone {
  const mood = normalizeMood(input.mood);
  const stress = clampScore(input.stressScore);
  const rhythm = clampScore(input.rhythmScore);
  const recovery = clampScore(input.recoveryScore);
  const focus = clampScore(input.focusScore);

  if (stress !== null && stress >= 0.72) return "charged";
  if (recovery !== null && recovery >= 0.65) return "restorative";
  if (focus !== null && focus >= 0.62) return "focused";
  if (rhythm !== null && rhythm <= 0.32) return "restorative";
  if (rhythm !== null && rhythm >= 0.72) return "focused";

  if (["anxious", "stressed", "overstimulated", "charged", "urgent", "angry"].includes(mood)) {
    return "charged";
  }

  if (["tired", "sad", "grief", "low", "recovering", "rest", "restorative"].includes(mood)) {
    return "restorative";
  }

  if (["focused", "productive", "clear", "curious", "flow"].includes(mood)) {
    return "focused";
  }

  if (["calm", "stable", "peaceful", "neutral"].includes(mood)) {
    return "calm";
  }

  return getFallbackTone(fallbackHour);
}

function readStoredEmotionState(): EmotionEngineInput | null {
  if (typeof window === "undefined") return null;

  for (const key of STORAGE_KEYS) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as EmotionEngineInput;
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Ignore malformed user-state payloads and keep the UI resilient.
    }
  }

  return null;
}

export function useEmotionalTone() {
  const [input, setInput] = useState<EmotionEngineInput | null>(null);
  const [hour, setHour] = useState(18);

  useEffect(() => {
    setHour(new Date().getHours());
    setInput(readStoredEmotionState());

    const onStorage = () => setInput(readStoredEmotionState());
    const onEmotionUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<EmotionEngineInput>;
      if (customEvent.detail && typeof customEvent.detail === "object") {
        setInput(customEvent.detail);
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("urai:emotion-state", onEmotionUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("urai:emotion-state", onEmotionUpdate);
    };
  }, []);

  return useMemo(() => resolveEmotionalTone(input ?? {}, hour), [input, hour]);
}
