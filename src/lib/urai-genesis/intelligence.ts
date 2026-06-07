import type {
  CognitiveStressSignal,
  DigitalMoodWeather,
  MemoryStar,
  MoodState,
  ObscuraPattern,
  OrbState,
  PassiveSignal,
  RhythmState,
  ShadowCognitionMetric,
  UraiSafetyTone,
} from "@/lib/types";
import {
  buildSafeNarratorMessage,
  clamp01,
  createMemoryStarFromSignal,
  moodWeatherFromMentalLoad,
  rhythmStateFromScore,
  scoreMentalLoad,
} from "@/lib/types";

export interface MentalLoadInput {
  shadowMetrics?: Pick<ShadowCognitionMetric, "value">[];
  obscuraPatterns?: Pick<ObscuraPattern, "intensity">[];
  stressSignals?: Pick<CognitiveStressSignal, "intensity">[];
}

export function calculateMentalLoadScore(input: MentalLoadInput): number {
  return scoreMentalLoad(input);
}

export function classifyRhythmState(score: number): RhythmState {
  return rhythmStateFromScore(score);
}

export function buildDigitalMoodWeather(params: {
  userId: string;
  score: number;
  mood?: Pick<MoodState, "valence" | "arousal" | "tags">;
  generatedAt?: string;
}): DigitalMoodWeather {
  const score01 = clamp01(params.score / 100);
  const weatherState = moodWeatherFromMentalLoad(params.score);
  const brightMood = params.mood?.valence === "bright";
  const lowMood = params.mood?.valence === "low";
  const aura = brightMood ? "aurora" : lowMood ? "blue-violet" : "soft-cyan";
  const narratorTone: UraiSafetyTone = params.score >= 72 ? "grounding" : brightMood ? "celebratory" : "gentle";
  const orbBehavior: OrbState["behavior"] = params.score >= 72 ? "grounding" : brightMood ? "celebrating" : "reflecting";

  return {
    id: `weather_${params.userId}_${params.generatedAt ?? "now"}`,
    userId: params.userId,
    generatedAt: params.generatedAt ?? new Date().toISOString(),
    weatherState,
    aura,
    particleIntensity: Math.round(score01 * 100) / 100,
    orbBehavior,
    groundBehavior: params.score >= 72 ? "threshold" : params.score >= 48 ? "recovering" : brightMood ? "blooming" : "quiet",
    narratorTone,
  };
}

export function buildMemoryStar(signal: PassiveSignal, now = new Date().toISOString()): MemoryStar {
  return createMemoryStarFromSignal(signal, now);
}

export function safeNarratorInsightFromSignals(summaries: string[]): string {
  const joined = summaries.filter(Boolean).join("; ").trim();
  return buildSafeNarratorMessage(joined || "a subtle shift in the field");
}

export function isUnsafeCertaintyClaim(text: string): boolean {
  const lowered = text.toLowerCase();
  return [
    "diagnosed",
    "you have depression",
    "you are bipolar",
    "they are lying",
    "they cheated",
    "they are abusive",
    "crisis will happen",
    "will self-harm",
  ].some((phrase) => lowered.includes(phrase));
}

export function softenSensitiveInsight(text: string): string {
  if (!text.trim()) return "A quiet signal may be worth noticing.";
  if (!isUnsafeCertaintyClaim(text)) return text;
  return "A possible signal shift may be worth noticing. Consider this a gentle reflection, not a conclusion.";
}
