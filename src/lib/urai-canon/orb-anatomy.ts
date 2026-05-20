export type UraiOrbState = "idle" | "hover" | "selected" | "charging" | "focus" | "replay" | "locked" | "reduced-motion";

export type UraiOrbLayer = {
  layerId: string;
  role: "outer-shell" | "glyph-skin" | "orbital-ring" | "energy-filament" | "crystal-fragment" | "core" | "halo" | "reflection";
  visibleInStates: readonly UraiOrbState[];
  opacity: number;
  motionSeconds: number;
  reducedMotionBehavior: "static" | "hidden" | "single-pulse";
  performanceCost: "low" | "medium" | "high";
};

export const URAI_ORB_ANATOMY_LAYERS: readonly UraiOrbLayer[] = [
  {
    layerId: "outer-moon-glass-shell",
    role: "outer-shell",
    visibleInStates: ["idle", "hover", "selected", "charging", "focus", "replay", "locked", "reduced-motion"],
    opacity: 0.92,
    motionSeconds: 0,
    reducedMotionBehavior: "static",
    performanceCost: "low",
  },
  {
    layerId: "floating-glyph-skin",
    role: "glyph-skin",
    visibleInStates: ["hover", "selected", "charging", "focus", "replay"],
    opacity: 0.32,
    motionSeconds: 28,
    reducedMotionBehavior: "hidden",
    performanceCost: "medium",
  },
  {
    layerId: "equatorial-field-ring",
    role: "orbital-ring",
    visibleInStates: ["idle", "hover", "selected", "charging", "focus", "replay"],
    opacity: 0.44,
    motionSeconds: 22,
    reducedMotionBehavior: "static",
    performanceCost: "low",
  },
  {
    layerId: "diagonal-counter-ring",
    role: "orbital-ring",
    visibleInStates: ["selected", "charging", "focus", "replay"],
    opacity: 0.34,
    motionSeconds: 31,
    reducedMotionBehavior: "hidden",
    performanceCost: "medium",
  },
  {
    layerId: "sealed-energy-filaments",
    role: "energy-filament",
    visibleInStates: ["charging", "focus", "replay"],
    opacity: 0.48,
    motionSeconds: 12,
    reducedMotionBehavior: "single-pulse",
    performanceCost: "medium",
  },
  {
    layerId: "living-core",
    role: "core",
    visibleInStates: ["idle", "hover", "selected", "charging", "focus", "replay", "locked", "reduced-motion"],
    opacity: 1,
    motionSeconds: 8,
    reducedMotionBehavior: "static",
    performanceCost: "low",
  },
  {
    layerId: "floor-reflection-vein",
    role: "reflection",
    visibleInStates: ["idle", "hover", "selected", "charging", "focus", "replay"],
    opacity: 0.26,
    motionSeconds: 18,
    reducedMotionBehavior: "static",
    performanceCost: "low",
  },
];

export function visibleOrbLayersForState(state: UraiOrbState): readonly UraiOrbLayer[] {
  return URAI_ORB_ANATOMY_LAYERS.filter((layer) => layer.visibleInStates.includes(state));
}

export function assertUraiOrbAnatomyIntegrity(): string[] {
  const failures: string[] = [];
  const seen = new Set<string>();

  for (const layer of URAI_ORB_ANATOMY_LAYERS) {
    if (seen.has(layer.layerId)) failures.push(`Duplicate orb layer: ${layer.layerId}`);
    seen.add(layer.layerId);
    if (layer.opacity < 0 || layer.opacity > 1) failures.push(`Orb layer opacity out of range: ${layer.layerId}`);
    if (layer.motionSeconds < 0) failures.push(`Orb layer motion cannot be negative: ${layer.layerId}`);
    if (layer.performanceCost === "high" && layer.reducedMotionBehavior !== "hidden") failures.push(`High-cost orb layer must hide in reduced motion: ${layer.layerId}`);
  }

  for (const requiredRole of ["outer-shell", "orbital-ring", "core", "reflection"] as const) {
    if (!URAI_ORB_ANATOMY_LAYERS.some((layer) => layer.role === requiredRole)) failures.push(`Missing orb anatomy role: ${requiredRole}`);
  }

  if (visibleOrbLayersForState("reduced-motion").some((layer) => layer.reducedMotionBehavior === "single-pulse")) {
    failures.push("Reduced-motion state must not include pulse-only animation layers.");
  }

  return failures;
}
