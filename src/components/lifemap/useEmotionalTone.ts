"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type EmotionalTone = "calm" | "focused" | "charged" | "restorative";

export type EmotionEngineInput = {
  mood?: string | null;
  stressScore?: number | null;
  rhythmScore?: number | null;
  recoveryScore?: number | null;
  focusScore?: number | null;
  socialLoadScore?: number | null;
  cognitiveLoadScore?: number | null;
  sleepDebtScore?: number | null;
  updatedAt?: string | null;
};

const STORAGE_KEYS = [
  "urai:pipeline-state",
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

function toInput(data: DocumentData | undefined): EmotionEngineInput | null {
  if (!data) return null;
  return {
    mood: typeof data.mood === "string" ? data.mood : typeof data.primaryMood === "string" ? data.primaryMood : null,
    stressScore: clampScore(data.stressScore ?? data.stress ?? data.shadowStress),
    rhythmScore: clampScore(data.rhythmScore ?? data.rhythm ?? data.stabilityScore),
    recoveryScore: clampScore(data.recoveryScore ?? data.recovery ?? data.restorationScore),
    focusScore: clampScore(data.focusScore ?? data.focus ?? data.clarityScore),
    socialLoadScore: clampScore(data.socialLoadScore ?? data.socialLoad),
    cognitiveLoadScore: clampScore(data.cognitiveLoadScore ?? data.cognitiveLoad ?? data.mentalLoad),
    sleepDebtScore: clampScore(data.sleepDebtScore ?? data.sleepDebt),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
  };
}

function mergeInputs(values: Array<EmotionEngineInput | null>): EmotionEngineInput {
  return values.reduce<EmotionEngineInput>((acc, item) => {
    if (!item) return acc;
    return { ...acc, ...Object.fromEntries(Object.entries(item).filter(([, value]) => value !== null && value !== undefined)) };
  }, {});
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
  const socialLoad = clampScore(input.socialLoadScore);
  const cognitiveLoad = clampScore(input.cognitiveLoadScore);
  const sleepDebt = clampScore(input.sleepDebtScore);

  if (stress !== null && stress >= 0.72) return "charged";
  if (cognitiveLoad !== null && cognitiveLoad >= 0.74) return "charged";
  if (socialLoad !== null && socialLoad >= 0.78) return "charged";
  if (sleepDebt !== null && sleepDebt >= 0.7) return "restorative";
  if (recovery !== null && recovery >= 0.65) return "restorative";
  if (focus !== null && focus >= 0.62) return "focused";
  if (rhythm !== null && rhythm <= 0.32) return "restorative";
  if (rhythm !== null && rhythm >= 0.72) return "focused";

  if (["anxious", "stressed", "overstimulated", "charged", "urgent", "angry"].includes(mood)) return "charged";
  if (["tired", "sad", "grief", "low", "recovering", "rest", "restorative"].includes(mood)) return "restorative";
  if (["focused", "productive", "clear", "curious", "flow"].includes(mood)) return "focused";
  if (["calm", "stable", "peaceful", "neutral"].includes(mood)) return "calm";

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
      // Keep fallback resilient.
    }
  }
  return null;
}

function cacheEmotionState(input: EmotionEngineInput | null) {
  if (typeof window === "undefined" || !input) return;
  window.localStorage.setItem("urai:pipeline-state", JSON.stringify(input));
}

export function useEmotionalTone() {
  const [input, setInput] = useState<EmotionEngineInput | null>(null);
  const [hour, setHour] = useState(18);

  useEffect(() => {
    setHour(new Date().getHours());
    setInput(readStoredEmotionState());

    const onStorage = () => setInput(readStoredEmotionState());
    const onPipelineUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<EmotionEngineInput>;
      if (customEvent.detail && typeof customEvent.detail === "object") {
        setInput(customEvent.detail);
        cacheEmotionState(customEvent.detail);
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("urai:emotion-state", onPipelineUpdate);
    window.addEventListener("urai:pipeline-state", onPipelineUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("urai:emotion-state", onPipelineUpdate);
      window.removeEventListener("urai:pipeline-state", onPipelineUpdate);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let unsubs: Array<() => void> = [];
    const unsubscribeAuth = onAuthStateChanged(auth(), (user) => {
      unsubs.forEach((unsubscribe) => unsubscribe());
      unsubs = [];

      if (!user) {
        setInput(readStoredEmotionState());
        return;
      }

      const latest: Record<string, EmotionEngineInput | null> = {};
      const publish = () => {
        const merged = mergeInputs(Object.values(latest));
        if (Object.keys(merged).length > 0) {
          setInput(merged);
          cacheEmotionState(merged);
        }
      };

      const paths = [
        ["users", user.uid, "state", "emotion"],
        ["users", user.uid, "dailyStates", "latest"],
        ["users", user.uid, "signals", "mentalLoad"],
        ["users", user.uid, "signals", "socialWellness"],
        ["users", user.uid, "signals", "sleepRecovery"],
        ["users", user.uid, "forecasts", "latest"],
      ];

      unsubs = paths.map((pathParts) =>
        onSnapshot(
          doc(db(), pathParts[0], ...pathParts.slice(1)),
          (snapshot) => {
            latest[pathParts.join("/")] = toInput(snapshot.data());
            publish();
          },
          () => {
            latest[pathParts.join("/")] = null;
            publish();
          },
        ),
      );
    });

    return () => {
      unsubs.forEach((unsubscribe) => unsubscribe());
      unsubscribeAuth();
    };
  }, []);

  return useMemo(() => resolveEmotionalTone(input ?? {}, hour), [input, hour]);
}
