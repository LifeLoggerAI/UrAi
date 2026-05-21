export type HomeWorldTier = 1 | 2 | 3 | 4 | 5;

export type OrbState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "memoryReplay"
  | "lifeMapOpening"
  | "recoveryBloom"
  | "shadowTension"
  | "dreamMode"
  | "focusMode"
  | "tierUpgrade"
  | "alert"
  | "offline"
  | "reducedMotion";

export type HomeMoodState = "calm" | "low" | "recovery" | "dream" | "shadow" | "focused" | "joy";
export type HomeRecoveryState = "dormant" | "recovering" | "stable" | "growing" | "awakened";

export type HomeWorldState = {
  userId: string;
  groundTier: HomeWorldTier;
  orbTier: HomeWorldTier;
  skyTier: HomeWorldTier;
  moodState: HomeMoodState;
  recoveryState: HomeRecoveryState;
  energyScore: number;
  narratorSpeaking: boolean;
  orbPulseIntensity: number;
  skyWeatherIntensity: number;
  groundGrowthIntensity: number;
  updatedAt: string;
};

export const DEFAULT_HOME_WORLD_STATE: HomeWorldState = {
  userId: "demo",
  groundTier: 3,
  orbTier: 3,
  skyTier: 3,
  moodState: "recovery",
  recoveryState: "growing",
  energyScore: 74,
  narratorSpeaking: false,
  orbPulseIntensity: 0.72,
  skyWeatherIntensity: 0.32,
  groundGrowthIntensity: 0.64,
  updatedAt: "demo"
};

function numberInRange(value: unknown, fallback: number, min: number, max: number) {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(min, Math.min(max, numeric));
}

function tier(value: unknown, fallback: HomeWorldTier): HomeWorldTier {
  const normalized = Math.round(numberInRange(value, fallback, 1, 5));
  return (normalized < 1 ? 1 : normalized > 5 ? 5 : normalized) as HomeWorldTier;
}

function mood(value: unknown, fallback: HomeMoodState): HomeMoodState {
  return value === "calm" || value === "low" || value === "recovery" || value === "dream" || value === "shadow" || value === "focused" || value === "joy"
    ? value
    : fallback;
}

function recovery(value: unknown, fallback: HomeRecoveryState): HomeRecoveryState {
  return value === "dormant" || value === "recovering" || value === "stable" || value === "growing" || value === "awakened"
    ? value
    : fallback;
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export function normalizeHomeWorldState(input: Record<string, unknown> | undefined, userId = "demo"): HomeWorldState {
  const source = input ?? {};
  return {
    userId: stringValue(source.userId, userId),
    groundTier: tier(source.groundTier, DEFAULT_HOME_WORLD_STATE.groundTier),
    orbTier: tier(source.orbTier, DEFAULT_HOME_WORLD_STATE.orbTier),
    skyTier: tier(source.skyTier, DEFAULT_HOME_WORLD_STATE.skyTier),
    moodState: mood(source.moodState, DEFAULT_HOME_WORLD_STATE.moodState),
    recoveryState: recovery(source.recoveryState, DEFAULT_HOME_WORLD_STATE.recoveryState),
    energyScore: numberInRange(source.energyScore, DEFAULT_HOME_WORLD_STATE.energyScore, 0, 100),
    narratorSpeaking: source.narratorSpeaking === true,
    orbPulseIntensity: numberInRange(source.orbPulseIntensity, DEFAULT_HOME_WORLD_STATE.orbPulseIntensity, 0, 1),
    skyWeatherIntensity: numberInRange(source.skyWeatherIntensity, DEFAULT_HOME_WORLD_STATE.skyWeatherIntensity, 0, 1),
    groundGrowthIntensity: numberInRange(source.groundGrowthIntensity, DEFAULT_HOME_WORLD_STATE.groundGrowthIntensity, 0, 1),
    updatedAt: stringValue(source.updatedAt, DEFAULT_HOME_WORLD_STATE.updatedAt)
  };
}

export function orbStateForHomeWorld(state: HomeWorldState, reducedMotion = false): OrbState {
  if (reducedMotion) return "reducedMotion";
  if (state.narratorSpeaking) return "speaking";
  if (state.moodState === "shadow") return "shadowTension";
  if (state.moodState === "dream") return "dreamMode";
  if (state.moodState === "focused") return "focusMode";
  if (state.recoveryState === "growing" || state.recoveryState === "awakened") return "recoveryBloom";
  if (state.energyScore <= 20) return "offline";
  return "idle";
}
