import {
  createDefaultConsentState,
  createDefaultPassportState,
} from "./consent";
import { createMemoryStarFromReflection } from "./memory-stars";
import { createGenesisReflectionFromSignal } from "./narrator";
import type {
  UraiGenesisHomeState,
  UraiMoodWeather,
  UraiPassiveSignal,
} from "./types";

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createDefaultMoodWeather(userId: string): UraiMoodWeather {
  return {
    userId,
    calculatedAt: new Date().toISOString(),
    skyState: "aurora",
    moodBlend: ["quiet", "beginning"],
    intensity: 0.42,
  };
}

export function createGenesisSystemSignal(userId: string): UraiPassiveSignal {
  return {
    id: createId("signal"),
    userId,
    source: "manualSystemEvent",
    capturedAt: new Date().toISOString(),
    title: "Genesis began",
    intensity: 0.45,
    emotionalTone: "hope",
    contextLabel: "first light",
    privacyLevel: "privateCloud",
    metadata: {
      genesis: true,
      systemGenerated: true,
    },
  };
}

export function createDefaultGenesisHomeState(userId: string): UraiGenesisHomeState {
  const signal = createGenesisSystemSignal(userId);
  const reflection = createGenesisReflectionFromSignal(signal);
  const star = createMemoryStarFromReflection(reflection, 0);

  return {
    userId,
    consent: createDefaultConsentState(userId),
    passport: createDefaultPassportState(userId),
    moodWeather: createDefaultMoodWeather(userId),
    latestSignals: [signal],
    latestReflections: [reflection],
    memoryStars: [star],
  };
}
