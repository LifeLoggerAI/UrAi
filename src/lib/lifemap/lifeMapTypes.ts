import type { GenesisMoodState } from "@/lib/companion/companionTypes";

export type PassportDataLayerId =
  | "mood"
  | "memory"
  | "relationships"
  | "location"
  | "audio"
  | "transcripts"
  | "calendar"
  | "gmail"
  | "deviceBehavior"
  | "screenActivity"
  | "notifications"
  | "motion"
  | "sleep"
  | "health"
  | "longTermPattern"
  | "ritual"
  | "milestone"
  | "recovery"
  | "shadow"
  | "legacy"
  | "passport"
  | "system"
  | "aiCompanion"
  | "lifeMap"
  | "ground"
  | "mirror"
  | "export";

export type LifeMapStarType =
  | "memory"
  | "mood"
  | "relationship"
  | "ritual"
  | "milestone"
  | "recovery"
  | "shadow"
  | "legacy"
  | "passport"
  | "system";

export type LifeMapStarIntensity = "quiet" | "soft" | "bright" | "flare" | "threshold";

export type LifeMapVisibility = "visible" | "private" | "hidden" | "requires_permission";

export type LifeMapStar = {
  id: string;
  type: LifeMapStarType;
  title: string;
  subtitle?: string;
  summary?: string;
  createdAt: string;
  emotionalTone?: GenesisMoodState;
  intensity: LifeMapStarIntensity;
  visibility: LifeMapVisibility;
  x: number;
  y: number;
  z?: number;
  chapterId?: string;
  sourceLayerId?: PassportDataLayerId;
  permissionRequired?: PassportDataLayerId;
  glyph?: string;
  colorHint?: string;
  opened?: boolean;
};

export type LifeMapChapter = {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate?: string;
  dominantMood?: GenesisMoodState;
  starIds: string[];
  constellationStyle?: "thread" | "spiral" | "arc" | "bloom" | "storm";
};

export type LifeMapData = {
  userId?: string;
  stars: LifeMapStar[];
  chapters: LifeMapChapter[];
  generatedAt: string;
  permissionVersion: number;
};

export type LifeMapSourceItem = {
  id?: string;
  title?: string;
  subtitle?: string;
  summary?: string;
  createdAt?: string;
  emotionalTone?: GenesisMoodState;
  intensity?: LifeMapStarIntensity;
};