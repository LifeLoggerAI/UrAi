import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";

export type MirrorPatternType =
  | "rhythm"
  | "mood_shift"
  | "recovery"
  | "overload"
  | "avoidance"
  | "focus"
  | "relationship"
  | "sleep"
  | "digital_load"
  | "threshold"
  | "shadow"
  | "legacy"
  | "system";

export type MirrorConfidence = "low" | "medium" | "high";

export type MirrorReflectionTone = "gentle" | "clear" | "protective" | "hopeful" | "grounding";

export type MirrorReflection = {
  id: string;
  title: string;
  summary: string;
  patternType: MirrorPatternType;
  tone: MirrorReflectionTone;
  confidence: MirrorConfidence;
  createdAt: string;
  sourceLayerIds: PassportDataLayerId[];
  permissionRequired?: PassportDataLayerId;
  suggestedAction?: "open_ground" | "open_life_map" | "open_passport" | "talk_to_companion" | "none";
  visible: boolean;
};

export type MirrorSession = {
  id: string;
  reflections: MirrorReflection[];
  generatedAt: string;
  permissionVersion: number;
};

export type MirrorSourceSummary = {
  id?: string;
  title?: string;
  summary?: string;
  patternType?: MirrorPatternType;
  tone?: MirrorReflectionTone;
  confidence?: MirrorConfidence;
  sourceLayerIds?: PassportDataLayerId[];
};
