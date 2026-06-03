import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";

export type RitualType =
  | "grounding"
  | "recovery"
  | "reflection"
  | "release"
  | "threshold"
  | "legacy"
  | "shadow_softening"
  | "focus"
  | "calm"
  | "system";

export type RitualIntensity = "tiny" | "soft" | "deep";
export type RitualStatus = "suggested" | "started" | "completed" | "skipped" | "saved" | "hidden";

export type RitualStep = {
  id: string;
  text: string;
  durationHint?: string;
  sensoryHint?: "breath" | "sound" | "touch" | "sight" | "movement" | "stillness";
};

export type UraiRitual = {
  id: string;
  title: string;
  subtitle?: string;
  type: RitualType;
  intensity: RitualIntensity;
  status: RitualStatus;
  summary: string;
  steps: RitualStep[];
  sourceType?: "life_map" | "ground" | "mirror" | "shadow" | "legacy" | "companion" | "system";
  sourceId?: string;
  sourceLayerIds: PassportDataLayerId[];
  createdAt: string;
  completedAt?: string;
  exportAllowed: boolean;
  addToLegacyAllowed: boolean;
};

export type RitualTemplate = {
  id: string;
  title: string;
  subtitle?: string;
  type: RitualType;
  intensity: RitualIntensity;
  summary: string;
  steps: RitualStep[];
  sourceLayerIds?: PassportDataLayerId[];
};

export type RitualSuggestionContext = {
  moodState?: string;
  selectedLifeMapStar?: { id: string; type?: string; sourceLayerId?: PassportDataLayerId } | null;
  selectedGroundElement?: { id: string; type?: string; sourceLayerId?: PassportDataLayerId } | null;
  selectedMirrorReflection?: { id: string; patternType?: string; sourceLayerIds?: PassportDataLayerId[] } | null;
  selectedShadowReflection?: { id: string; sourceLayerIds?: PassportDataLayerId[]; visibility?: string } | null;
  selectedLegacyItem?: { id: string; type?: string; sourceLayerIds?: PassportDataLayerId[] } | null;
  passportProfile?: {
    ritualsEnabled?: boolean;
    shadowEnabled?: boolean;
    legacyEnabled?: boolean;
    exportEnabled?: boolean;
    enabledLayers?: Partial<Record<PassportDataLayerId, boolean>>;
  } | null;
};
