export type UraiGenesisVersion = 'genesis-v1';

export type UraiConsentCategory =
  | 'audio'
  | 'location'
  | 'motion'
  | 'deviceActivity'
  | 'notifications'
  | 'calendar'
  | 'contacts'
  | 'health'
  | 'photos'
  | 'passport';

export interface UraiConsentCategoryConfig {
  id: UraiConsentCategory;
  label: string;
  description: string;
  requiredForGenesisLoop: boolean;
}

export interface UraiConsentState {
  userId: string;
  version: UraiGenesisVersion;
  categories: Record<UraiConsentCategory, boolean>;
  allEnabled: boolean;
  lastUpdatedAt: string;
}

export type UraiPassportState = {
  userId: string;
  version: UraiGenesisVersion;
  shareMode: 'private' | 'public';
  allowedCategories: UraiConsentCategory[];
  updatedAt: string;
};

export type UraiMoodWeatherState =
  | 'clear'
  | 'greenRecoveryBloom'
  | 'blueFog'
  | 'threshold'
  | 'bond'
  | 'reflection'
  | 'storm'
  | 'calm'
  | 'aurora';

export interface UraiMoodWeather {
  userId: string;
  calculatedAt: string;
  skyState: string;
  moodBlend: string[];
  intensity: number;
  [key: string]: unknown;
}

export type UraiPassiveSignalKind =
  | 'audio'
  | 'location'
  | 'motion'
  | 'deviceActivity'
  | 'notification'
  | 'calendar'
  | 'contact'
  | 'health'
  | 'photo'
  | 'passport'
  | 'manual'
  | 'system';

export type UraiPassiveSignal = {
  id: string;
  userId: string;
  source?: string;
  kind?: UraiPassiveSignalKind;
  title?: string;
  label?: string;
  value?: string | number | boolean | null;
  intensity?: number;
  confidence?: number;
  capturedAt?: string;
  timestamp?: string;
  emotionalTone?: string;
  contextLabel?: string;
  privacyLevel?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type UraiGenesisHomeState = {
  userId: string;
  consent?: UraiConsentState;
  passport?: UraiPassportState;
  moodWeather: UraiMoodWeather;
  latestSignals?: UraiPassiveSignal[];
  activeSignals?: UraiPassiveSignal[];
  displayName?: string;
  currentState?: string;
  auraColor?: string;
  recoveryLevel?: number;
  fieldIntensity?: number;
  lastUpdated?: string;
  narratorLine?: string;
  [key: string]: unknown;
};

export interface UserFieldState {
  userId: string;
  displayName: string;
  currentState: string;
  auraColor: string;
  recoveryLevel: number;
  fieldIntensity: number;
  lastUpdated: string;
}

export interface MemoryStar {
  id: string;
  userId: string;
  title: string;
  state: string;
  era: string;
  narratorLine: string;
  x: number;
  y: number;
  z: number;
  intensity: number;
  relatedStarIds: string[];
  createdAt: string;
}

export interface ReplayScene {
  id: string;
  userId: string;
  title: string;
  state: string;
  era: string;
  narratorLine: string;
  duration: number;
  order: number;
  memoryStarId: string;
}

export interface PassportPermission {
  id: string;
  userId: string;
  category: string;
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  description: string;
  updatedAt: string;
}

/* Legacy URAI compatibility exports */
export type UraiNarratorTone =
  | 'calm'
  | 'clear'
  | 'protective'
  | 'celebratory'
  | 'mythic';

export type UraiNarratorReflection = {
  id: string;
  userId: string;
  createdAt: string;
  signalIds: string[];
  title: string;
  body: string;
  tone: UraiNarratorTone;
  visibleToUser: boolean;
  [key: string]: unknown;
};

export type UraiMemoryStar = {
  id: string;
  userId: string;
  createdAt: string;
  reflectionId?: string;
  label?: string;
  title?: string;
  constellation?: string;
  auraColor?: string;
  magnitude?: number;
  x: number;
  y: number;
  z: number;
  [key: string]: unknown;
};

/* Signal pipeline compatibility exports */
export type UraiPassiveSignalSource =
  | 'manualSystemEvent'
  | 'audio'
  | 'location'
  | 'motion'
  | 'deviceActivity'
  | 'notification'
  | 'calendar'
  | 'contact'
  | 'health'
  | 'photo'
  | 'passport'
  | 'system'
  | 'imported'
  | (string & {});

export type UraiPrivacyLevel =
  | 'localOnly'
  | 'privateCloud'
  | 'encryptedCloud'
  | 'passportShared'
  | 'public'
  | (string & {});
