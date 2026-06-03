import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";

export type ShadowPatternType =
  | "avoidance_loop"
  | "overload_loop"
  | "isolation_signal"
  | "shame_regret_loop"
  | "conflict_echo"
  | "silence_pattern"
  | "sleep_disruption"
  | "digital_spiral"
  | "recovery_interruption"
  | "threshold_stress"
  | "grief_echo"
  | "anger_heat"
  | "numbness_signal"
  | "system";

export type ShadowIntensity = "soft" | "noticeable" | "heavy" | "threshold";
export type ShadowSafetyLevel = "normal" | "gentle" | "protective" | "crisis_boundary";
export type ShadowVisibility = "hidden" | "locked" | "visible" | "softened";

export type ShadowReflection = {
  id: string;
  title: string;
  softenedTitle?: string;
  summary: string;
  softenedSummary?: string;
  patternType: ShadowPatternType;
  intensity: ShadowIntensity;
  safetyLevel: ShadowSafetyLevel;
  visibility: ShadowVisibility;
  confidence: "low" | "medium" | "high";
  createdAt: string;
  sourceLayerIds: PassportDataLayerId[];
  permissionRequired?: PassportDataLayerId;
  suggestedAction?: "open_ground" | "talk_to_guardian" | "open_passport" | "soften_view" | "hide" | "none";
  userCanHide: boolean;
  userCanSoften: boolean;
};

export type ShadowSession = {
  id: string;
  reflections: ShadowReflection[];
  generatedAt: string;
  permissionVersion: number;
  shadowConsentConfirmed: boolean;
};

export type ShadowViewMode = "sealed" | "soft" | "clear" | "guardian";

export type ShadowSourceSummary = {
  id?: string;
  title?: string;
  softenedTitle?: string;
  summary?: string;
  softenedSummary?: string;
  patternType?: ShadowPatternType;
  intensity?: ShadowIntensity;
  safetyLevel?: ShadowSafetyLevel;
  confidence?: "low" | "medium" | "high";
  sourceLayerIds?: PassportDataLayerId[];
};
