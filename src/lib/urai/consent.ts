import type {
  UraiConsentCategory,
  UraiConsentCategoryConfig,
  UraiConsentState,
  UraiGenesisVersion,
  UraiPassportState,
} from "./types";

export const URAI_GENESIS_VERSION: UraiGenesisVersion = "genesis-v1";

export const URAI_CONSENT_CATEGORIES: UraiConsentCategoryConfig[] = [
  {
    id: "audio",
    label: "Audio",
    description: "Voice, sound, and spoken context when enabled.",
    requiredForGenesisLoop: true,
  },
  {
    id: "location",
    label: "Location",
    description: "Place and movement context for memories and reflections.",
    requiredForGenesisLoop: true,
  },
  {
    id: "motion",
    label: "Motion",
    description: "Stillness, activity, transitions, and rhythm shifts.",
    requiredForGenesisLoop: false,
  },
  {
    id: "deviceActivity",
    label: "Device Activity",
    description: "Digital rhythm, focus, and overstimulation patterns.",
    requiredForGenesisLoop: false,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Interruption load and communication pressure.",
    requiredForGenesisLoop: false,
  },
  {
    id: "calendar",
    label: "Calendar",
    description: "Schedule context for reflection and preparation.",
    requiredForGenesisLoop: false,
  },
  {
    id: "contacts",
    label: "Contacts",
    description: "Relationship context when permitted.",
    requiredForGenesisLoop: false,
  },
  {
    id: "health",
    label: "Health",
    description: "Wellness and recovery signals when available.",
    requiredForGenesisLoop: false,
  },
  {
    id: "photos",
    label: "Photos",
    description: "Visual memories for life-map moments when enabled.",
    requiredForGenesisLoop: false,
  },
  {
    id: "passport",
    label: "URAI Passport",
    description: "Review, export, and sharing control.",
    requiredForGenesisLoop: true,
  },
];

export function createDefaultConsentState(userId: string): UraiConsentState {
  const categories = URAI_CONSENT_CATEGORIES.reduce(
    (acc, category) => {
      acc[category.id] = false;
      return acc;
    },
    {} as Record<UraiConsentCategory, boolean>,
  );

  return {
    userId,
    version: URAI_GENESIS_VERSION,
    categories,
    allEnabled: false,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function setConsentCategory(
  state: UraiConsentState,
  category: UraiConsentCategory,
  enabled: boolean,
): UraiConsentState {
  const nextCategories = {
    ...state.categories,
    [category]: enabled,
  };

  return {
    ...state,
    categories: nextCategories,
    allEnabled: Object.values(nextCategories).every(Boolean),
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function setAllConsentCategories(state: UraiConsentState, enabled: boolean): UraiConsentState {
  const nextCategories = Object.keys(state.categories).reduce(
    (acc, category) => {
      acc[category as UraiConsentCategory] = enabled;
      return acc;
    },
    {} as Record<UraiConsentCategory, boolean>,
  );

  return {
    ...state,
    categories: nextCategories,
    allEnabled: enabled,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function createDefaultPassportState(userId: string): UraiPassportState {
  return {
    userId,
    version: URAI_GENESIS_VERSION,
    shareMode: "private",
    allowedCategories: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getEnabledConsentCategories(state: UraiConsentState): UraiConsentCategory[] {
  return Object.entries(state.categories)
    .filter(([, enabled]) => enabled)
    .map(([category]) => category as UraiConsentCategory);
}

export function hasGenesisRequiredConsent(state: UraiConsentState): boolean {
  return URAI_CONSENT_CATEGORIES.filter((category) => category.requiredForGenesisLoop).every(
    (category) => state.categories[category.id],
  );
}
