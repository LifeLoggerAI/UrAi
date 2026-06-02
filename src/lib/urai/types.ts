export type UraiISODateString = string;

export type UraiGenesisVersion = "genesis-v1";

export type UraiConsentCategory =
  | "audio"
  | "location"
  | "motion"
  | "deviceActivity"
  | "notifications"
  | "calendar"
  | "contacts"
  | "health"
  | "photos"
  | "passport";

export type UraiConsentCategoryConfig = {
  id: UraiConsentCategory;
  label: string;
  description: string;
  requiredForGenesisLoop: boolean;
};

export type UraiConsentState = {
  userId: string;
  version: UraiGenesisVersion;
  categories: Record<UraiConsentCategory, boolean>;
  allEnabled: boolean;
  lastUpdatedAt: UraiISODateString;
};

export type UraiPassportShareMode = "private" | "reviewOnly" | "shareable" | "disabled";

export type UraiPassportState = {
  userId: string;
  version: UraiGenesisVersion;
  shareMode: UraiPassportShareMode;
  allowedCategories: UraiConsentCategory[];
  lastReviewedAt?: UraiISODateString;
  updatedAt: UraiISODateString;
};

export type UraiPassiveSignalSource =
  | "audio"
  | "location"
  | "motion"
  | "deviceActivity"
  | "notification"
  | "calendar"
  | "health"
  | "photo"
  | "manualSystemEvent";

export type UraiPrivacyLevel = "localOnly" | "privateCloud" | "passportShareable";

export type UraiPassiveSignal = {
  id: string;
  userId: string;
  source: UraiPassiveSignalSource;
  capturedAt: UraiISODateString;
  title?: string;
  intensity?: number;
  emotionalTone?: string;
  contextLabel?: string;
  rawStorageRef?: string;
  privacyLevel: UraiPrivacyLevel;
  metadata?: Record<string, unknown>;
};

export type UraiNarratorTone = "calm" | "mythic" | "clear" | "protective" | "celebratory";

export type UraiNarratorReflection = {
  id: string;
  userId: string;
  createdAt: UraiISODateString;
  signalIds: string[];
  title: string;
  body: string;
  tone: UraiNarratorTone;
  visibleToUser: boolean;
};

export type UraiMemoryStar = {
  id: string;
  userId: string;
  createdAt: UraiISODateString;
  reflectionId?: string;
  label: string;
  constellation?: string;
  auraColor: string;
  magnitude: number;
  x: number;
  y: number;
  z?: number;
};

export type UraiMoodSkyState = "clear" | "mist" | "rain" | "storm" | "sunrise" | "night" | "aurora";

export type UraiMoodWeather = {
  userId: string;
  calculatedAt: UraiISODateString;
  skyState: UraiMoodSkyState;
  moodBlend: string[];
  intensity: number;
};

export type UraiGenesisHomeState = {
  userId: string;
  consent: UraiConsentState;
  passport: UraiPassportState;
  moodWeather: UraiMoodWeather;
  latestSignals: UraiPassiveSignal[];
  latestReflections: UraiNarratorReflection[];
  memoryStars: UraiMemoryStar[];
};
