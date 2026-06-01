import { createMemoryStarFromReflection } from "./memory-stars";
import { createGenesisReflectionFromSignal } from "./narrator";
import {
  saveMemoryStar,
  saveNarratorReflection,
  savePassiveSignal,
  type UraiPersistenceStatus,
} from "./storage";
import type {
  UraiMemoryStar,
  UraiNarratorReflection,
  UraiPassiveSignal,
  UraiPassiveSignalSource,
  UraiPrivacyLevel,
} from "./types";

type CreatePassiveSignalInput = {
  userId: string;
  source: UraiPassiveSignalSource;
  title?: string;
  intensity?: number;
  emotionalTone?: string;
  contextLabel?: string;
  privacyLevel?: UraiPrivacyLevel;
  metadata?: Record<string, unknown>;
};

export type UraiSignalPipelineResult = {
  signal: UraiPassiveSignal;
  reflection: UraiNarratorReflection;
  memoryStar: UraiMemoryStar;
  persistenceStatus: UraiPersistenceStatus;
};

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createPassiveSignal(input: CreatePassiveSignalInput): UraiPassiveSignal {
  return {
    id: createId("signal"),
    userId: input.userId,
    source: input.source,
    capturedAt: new Date().toISOString(),
    title: input.title,
    intensity: input.intensity,
    emotionalTone: input.emotionalTone,
    contextLabel: input.contextLabel,
    privacyLevel: input.privacyLevel ?? "privateCloud",
    metadata: input.metadata,
  };
}

export async function runGenesisSignalPipeline(
  input: CreatePassiveSignalInput,
  starIndex = 0,
): Promise<UraiSignalPipelineResult> {
  const signal = createPassiveSignal(input);
  const reflection = createGenesisReflectionFromSignal(signal);
  const memoryStar = createMemoryStarFromReflection(reflection, starIndex);

  const statuses = await Promise.all([
    savePassiveSignal(signal),
    saveNarratorReflection(reflection),
    saveMemoryStar(memoryStar),
  ]);

  return {
    signal,
    reflection,
    memoryStar,
    persistenceStatus: statuses.includes("firebase") ? "firebase" : "local",
  };
}
