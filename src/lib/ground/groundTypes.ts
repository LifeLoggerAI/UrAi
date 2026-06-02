import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";

export type GroundElementType =
  | "root"
  | "sprout"
  | "bloom"
  | "stone"
  | "water"
  | "lantern"
  | "ritualSeed"
  | "recoveryBloom"
  | "habitPlant"
  | "shadowMoss"
  | "legacyTree"
  | "passportGate"
  | "system";

export type GroundElementState =
  | "dormant"
  | "growing"
  | "steady"
  | "blooming"
  | "recovering"
  | "withering"
  | "protected"
  | "hidden"
  | "requires_permission";

export type GroundElement = {
  id: string;
  type: GroundElementType;
  title: string;
  subtitle?: string;
  summary?: string;
  state: GroundElementState;
  createdAt: string;
  updatedAt?: string;
  sourceLayerId?: PassportDataLayerId;
  permissionRequired?: PassportDataLayerId;
  emotionalTone?: GenesisMoodState;
  growthScore?: number;
  recoveryScore?: number;
  position: { x: number; y: number; scale?: number };
  visualHint?: string;
  opened?: boolean;
};

export type GroundGardenData = {
  userId?: string;
  elements: GroundElement[];
  generatedAt: string;
  permissionVersion: number;
  dominantState?: GroundElementState;
};

export type GroundSourceItem = {
  id?: string;
  title?: string;
  subtitle?: string;
  summary?: string;
  createdAt?: string;
  updatedAt?: string;
  emotionalTone?: GenesisMoodState;
  growthScore?: number;
  recoveryScore?: number;
};
