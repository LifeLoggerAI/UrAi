export type GroundTier = 1 | 2 | 3 | 4 | 5;

export type RhythmState = "off-rhythm" | "overstimulated" | "stable" | "recovering" | "flow";

export type GroundSignalState = {
  moodScore?: number | null;
  rhythmState?: RhythmState | string | null;
  recoveryScore?: number | null;
  vitalityScore?: number | null;
  symbolicIntensity?: number | null;
  shadowStress?: number | null;
};

export type GroundTierDefinition = {
  tier: GroundTier;
  name: string;
  title: string;
  emotionalMeaning: string;
  visualAppearance: string;
  animationBehavior: string;
  dataTriggerLogic: string;
  componentState: string;
  assetRequirements: string;
  accessibilityBehavior: string;
  fallbackBehavior: string;
};

export const GROUND_TIER_DEFINITIONS: Record<GroundTier, GroundTierDefinition> = {
  1: {
    tier: 1,
    name: "dormant",
    title: "Tier 1 — Dormant Ground",
    emotionalMeaning: "Quiet, low-growth, protected, not dead. The user is conserving energy.",
    visualAppearance: "Dark soil, sparse moss, soft horizon haze, faint root lines, minimal bloom activity.",
    animationBehavior: "Very slow breath, low ember pulse, almost-still root shimmer.",
    dataTriggerLogic: "Low vitality or mood, off-rhythm state, high shadow stress, or missing recovery evidence.",
    componentState: "ground-tier-1 with restrained glow, low particle count, dormant root geometry.",
    assetRequirements: "No external asset required; CSS gradients/SVG sprouts render the fallback. Optional /assets/ground/tier-1.* can replace later.",
    accessibilityBehavior: "Decorative visuals are aria-hidden; semantic tier label is exposed in text when debug/details are enabled.",
    fallbackBehavior: "Used when state is missing, invalid, or explicitly low-signal."
  },
  2: {
    tier: 2,
    name: "sprout",
    title: "Tier 2 — Early Sprout",
    emotionalMeaning: "Subtle recovery has started. The system sees small evidence of return.",
    visualAppearance: "Small sprouts, warmer soil edge, thin luminous roots, tiny dew glints.",
    animationBehavior: "Gentle upward sprout motion, intermittent dew sparkle, slow root pulse.",
    dataTriggerLogic: "Recovering rhythm, modest recovery score, or improving mood/vitality from a low baseline.",
    componentState: "ground-tier-2 with visible sprouts and cautious light.",
    assetRequirements: "CSS/SVG fallback locked; optional tier-2 sprite/video can be layered later.",
    accessibilityBehavior: "Motion obeys prefers-reduced-motion and tier meaning can be read as text.",
    fallbackBehavior: "Falls back to Tier 1 if tier parsing fails; no broken visual state."
  },
  3: {
    tier: 3,
    name: "rooted",
    title: "Tier 3 — Rooted Stable Ground",
    emotionalMeaning: "The user is grounded, stable, and emotionally rooted.",
    visualAppearance: "Balanced green bed, clear roots, calm glow, steady atmospheric base.",
    animationBehavior: "Smooth breathing glow, stable root shimmer, mild ambient particles.",
    dataTriggerLogic: "Stable rhythm, mid mood, mid vitality, and normal recovery/shadow balance.",
    componentState: "ground-tier-3 default healthy state.",
    assetRequirements: "CSS/SVG fallback locked; can accept final branded ground assets later without schema changes.",
    accessibilityBehavior: "High contrast labels and non-essential animations suppressed under reduced motion.",
    fallbackBehavior: "Default tier for healthy demo state when no high/low signals dominate."
  },
  4: {
    tier: 4,
    name: "blooming",
    title: "Tier 4 — Blooming Ground",
    emotionalMeaning: "The user has strong vitality, recovery, and emotional lift.",
    visualAppearance: "Bloom clusters, richer grass, golden rim light, increased depth and aura.",
    animationBehavior: "Bloom pulse, petal glints, richer upward energy and more visible root light.",
    dataTriggerLogic: "High recovery/vitality, flow rhythm, good mood, and low-to-normal shadow stress.",
    componentState: "ground-tier-4 with bloom layer enabled.",
    assetRequirements: "CSS/SVG fallback locked; optional flower overlays can be added as transparent PNG/WebP.",
    accessibilityBehavior: "Visual intensity remains elegant; reduced motion keeps static bloom composition.",
    fallbackBehavior: "Drops to Tier 3 when high signals are incomplete or contradictory."
  },
  5: {
    tier: 5,
    name: "mythic",
    title: "Tier 5 — Mythic Ground",
    emotionalMeaning: "Rare peak state: fully alive, symbolic, magical, and integrated.",
    visualAppearance: "Luminous mythic roots, bloom crown, star pollen, deep atmospheric glow, elegant magic.",
    animationBehavior: "Slow radiant pulse, constellation-like ground particles, ceremonial bloom shimmer.",
    dataTriggerLogic: "Very high vitality/recovery plus flow/stable rhythm and high symbolic intensity with low shadow stress.",
    componentState: "ground-tier-5 with mythic aura and peak-state particle layer.",
    assetRequirements: "CSS/SVG fallback locked; optional mythic animated asset can replace only the decorative layer.",
    accessibilityBehavior: "No flashing; all motion is slow, reduced-motion-safe, and decorative.",
    fallbackBehavior: "Drops to Tier 4 if the peak state is not confidently supported."
  }
};

const clamp01 = (value: number | null | undefined, fallback = 0.5): number => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  if (value > 1) return Math.max(0, Math.min(1, value / 100));
  return Math.max(0, Math.min(1, value));
};

export function resolveGroundTier(state: GroundSignalState = {}): GroundTier {
  const mood = clamp01(state.moodScore, 0.52);
  const recovery = clamp01(state.recoveryScore, 0.5);
  const vitality = clamp01(state.vitalityScore, 0.5);
  const symbolic = clamp01(state.symbolicIntensity, 0.35);
  const shadow = clamp01(state.shadowStress, 0.25);
  const rhythm = String(state.rhythmState ?? "stable").toLowerCase();

  const rhythmBonus = rhythm === "flow" ? 0.18 : rhythm === "stable" ? 0.08 : rhythm === "recovering" ? 0.02 : rhythm === "overstimulated" ? -0.12 : rhythm === "off-rhythm" ? -0.18 : 0;
  const score = mood * 0.24 + recovery * 0.28 + vitality * 0.26 + symbolic * 0.12 + (1 - shadow) * 0.1 + rhythmBonus;

  if (score >= 0.86 && symbolic >= 0.72 && recovery >= 0.78 && vitality >= 0.78 && shadow <= 0.32) return 5;
  if (score >= 0.68 && recovery >= 0.62 && vitality >= 0.6 && shadow <= 0.5) return 4;
  if (score >= 0.46 && shadow <= 0.72) return 3;
  if (score >= 0.3 || rhythm === "recovering") return 2;
  return 1;
}

export const GROUND_PREVIEW_STATES: Record<GroundTier, GroundSignalState> = {
  1: { moodScore: 22, rhythmState: "off-rhythm", recoveryScore: 18, vitalityScore: 20, symbolicIntensity: 25, shadowStress: 82 },
  2: { moodScore: 40, rhythmState: "recovering", recoveryScore: 44, vitalityScore: 38, symbolicIntensity: 35, shadowStress: 58 },
  3: { moodScore: 58, rhythmState: "stable", recoveryScore: 55, vitalityScore: 56, symbolicIntensity: 42, shadowStress: 34 },
  4: { moodScore: 76, rhythmState: "flow", recoveryScore: 72, vitalityScore: 74, symbolicIntensity: 58, shadowStress: 24 },
  5: { moodScore: 92, rhythmState: "flow", recoveryScore: 91, vitalityScore: 94, symbolicIntensity: 88, shadowStress: 12 }
};

export function coerceGroundTier(value: unknown): GroundTier | null {
  const parsed = Number(value);
  return parsed >= 1 && parsed <= 5 && Number.isInteger(parsed) ? (parsed as GroundTier) : null;
}
