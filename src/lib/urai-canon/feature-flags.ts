export type UraiLifeMapFeatureFlags = {
  lifeMapTier1: boolean;
  lifeMapTier2: boolean;
  lifeMapTier3: boolean;
  lifeMapTier4: boolean;
  lifeMapTier5: boolean;
  homeRecommendations: boolean;
  constellationGrouping: boolean;
  replayChapters: boolean;
  replayJourneys: boolean;
  artifacts: boolean;
  advancedCinematics: boolean;
  personalizationSignals: boolean;
  reducedMotionCinematics: boolean;
};

export const URAI_DEFAULT_FEATURE_FLAGS: UraiLifeMapFeatureFlags = {
  lifeMapTier1: true,
  lifeMapTier2: true,
  lifeMapTier3: false,
  lifeMapTier4: false,
  lifeMapTier5: false,
  homeRecommendations: true,
  constellationGrouping: false,
  replayChapters: true,
  replayJourneys: false,
  artifacts: false,
  advancedCinematics: false,
  personalizationSignals: true,
  reducedMotionCinematics: true,
};

export const URAI_FEATURE_FLAG_ENV_KEYS: Record<keyof UraiLifeMapFeatureFlags, string> = {
  lifeMapTier1: "NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_1",
  lifeMapTier2: "NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_2",
  lifeMapTier3: "NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_3",
  lifeMapTier4: "NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_4",
  lifeMapTier5: "NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_5",
  homeRecommendations: "NEXT_PUBLIC_URAI_FLAG_HOME_RECOMMENDATIONS",
  constellationGrouping: "NEXT_PUBLIC_URAI_FLAG_CONSTELLATION_GROUPING",
  replayChapters: "NEXT_PUBLIC_URAI_FLAG_REPLAY_CHAPTERS",
  replayJourneys: "NEXT_PUBLIC_URAI_FLAG_REPLAY_JOURNEYS",
  artifacts: "NEXT_PUBLIC_URAI_FLAG_ARTIFACTS",
  advancedCinematics: "NEXT_PUBLIC_URAI_FLAG_ADVANCED_CINEMATICS",
  personalizationSignals: "NEXT_PUBLIC_URAI_FLAG_PERSONALIZATION_SIGNALS",
  reducedMotionCinematics: "NEXT_PUBLIC_URAI_FLAG_REDUCED_MOTION_CINEMATICS",
};

export const URAI_FLAG_SAFE_FALLBACKS: Record<keyof UraiLifeMapFeatureFlags, string> = {
  lifeMapTier1: "Render canonical routes with empty-state shells and core navigation.",
  lifeMapTier2: "Hide personalization extras while preserving Tier 1 route/data behavior.",
  lifeMapTier3: "Render flat star field without grouped constellations or dense-map layout.",
  lifeMapTier4: "Render single-scene replay cards without journeys, artifacts, or scene asset loading.",
  lifeMapTier5: "Render mature-shell defaults without advanced dashboards, Storybook, or governance panels.",
  homeRecommendations: "Show manual next action and Life Map entry instead of recommended action.",
  constellationGrouping: "Show ungrouped stars with sparse safe layout.",
  replayChapters: "Show replay overview and evidence list without chapter navigation.",
  replayJourneys: "Show replay detail as a single evidence-backed theater scene.",
  artifacts: "Hide artifact gallery and show locked collectible placeholder copy.",
  advancedCinematics: "Use static premium depth, reduced bloom, and no heavy camera path.",
  personalizationSignals: "Use explicit user-chosen filters only.",
  reducedMotionCinematics: "Disable parallax-heavy motion and prefer static cinematic composition.",
};

function parseEnvFlag(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") return fallback;
  if (["1", "true", "yes", "on"].includes(value.toLowerCase())) return true;
  if (["0", "false", "no", "off"].includes(value.toLowerCase())) return false;
  return fallback;
}

export function resolveUraiFeatureFlags(env: Record<string, string | undefined> = process.env): UraiLifeMapFeatureFlags {
  const resolved = { ...URAI_DEFAULT_FEATURE_FLAGS };

  for (const flag of Object.keys(URAI_DEFAULT_FEATURE_FLAGS) as Array<keyof UraiLifeMapFeatureFlags>) {
    resolved[flag] = parseEnvFlag(env[URAI_FEATURE_FLAG_ENV_KEYS[flag]], URAI_DEFAULT_FEATURE_FLAGS[flag]);
  }

  if (!resolved.lifeMapTier1) {
    resolved.lifeMapTier2 = false;
    resolved.lifeMapTier3 = false;
    resolved.lifeMapTier4 = false;
    resolved.lifeMapTier5 = false;
  }

  if (!resolved.lifeMapTier2) {
    resolved.lifeMapTier3 = false;
    resolved.lifeMapTier4 = false;
    resolved.lifeMapTier5 = false;
    resolved.homeRecommendations = false;
    resolved.personalizationSignals = false;
  }

  if (!resolved.lifeMapTier3) {
    resolved.lifeMapTier4 = false;
    resolved.lifeMapTier5 = false;
    resolved.constellationGrouping = false;
  }

  if (!resolved.lifeMapTier4) {
    resolved.lifeMapTier5 = false;
    resolved.replayJourneys = false;
    resolved.artifacts = false;
  }

  return resolved;
}

export function getDisabledFlagFallbacks(flags: UraiLifeMapFeatureFlags): string[] {
  return (Object.keys(flags) as Array<keyof UraiLifeMapFeatureFlags>)
    .filter((flag) => !flags[flag])
    .map((flag) => `${flag}: ${URAI_FLAG_SAFE_FALLBACKS[flag]}`);
}

export function assertUraiFeatureFlagIntegrity(flags: UraiLifeMapFeatureFlags = resolveUraiFeatureFlags()): string[] {
  const failures: string[] = [];

  if (flags.lifeMapTier5 && !flags.lifeMapTier4) failures.push("Tier 5 cannot be enabled before Tier 4.");
  if (flags.lifeMapTier4 && !flags.lifeMapTier3) failures.push("Tier 4 cannot be enabled before Tier 3.");
  if (flags.lifeMapTier3 && !flags.lifeMapTier2) failures.push("Tier 3 cannot be enabled before Tier 2.");
  if (flags.lifeMapTier2 && !flags.lifeMapTier1) failures.push("Tier 2 cannot be enabled before Tier 1.");

  for (const flag of Object.keys(URAI_DEFAULT_FEATURE_FLAGS) as Array<keyof UraiLifeMapFeatureFlags>) {
    if (!URAI_FLAG_SAFE_FALLBACKS[flag]) failures.push(`Missing safe fallback for feature flag: ${flag}`);
    if (!URAI_FEATURE_FLAG_ENV_KEYS[flag]) failures.push(`Missing env key for feature flag: ${flag}`);
  }

  return failures;
}
