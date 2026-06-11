/**
 * Thematic categories for memories, used for filtering and visual representation.
 */
export type UraiMemoryType =
  | "milestone"
  | "memory"
  | "mood"
  | "ritual"
  | "relationship"
  | "recovery"
  | "shadow"
  | "legacy"
  | "passport"
  | "system";

/**
 * The primary emotional valence of the memory, influencing its presentation.
 */
export type UraiEmotionalState = "luminous" | "shadow" | "neutral";

/**
 * The visual prominence or energy level of a memory on the Life Map.
 */
export type UraiGlowIntensity = "quiet" | "soft" | "bright" | "flare" | "threshold";

/**
 * Controls the visibility and access level of a memory.
 * - public: Visible to URAI and user.
 * - private: User-only, URAI has no access.
 * - hidden: Not currently displayed on the map.
 * - requires_permission: A special state for memories URAI knows about but cannot access yet.
 */
export type UraiMemoryVisibility = "public" | "private" | "hidden" | "requires_permission";

/**
 * Represents a single, foundational memory unit in the URAI system.
 * This structure is designed to be extensible for different types of memories
 * and their interactions within the URAI ecosystem.
 */
export interface UraiMemory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: UraiMemoryType;
  emotionalState: UraiEmotionalState;
  symbolicState: string; // e.g., 'threshold_gate', 'first_light'
  replayAvailable: boolean;
  passportAvailable: boolean;
  createdAt: string; // ISO 8601 date string
  constellationPosition: {
    x: number; // Position on the 2D Life Map canvas (0-100%)
    y: number;
  };
  glowIntensity: UraiGlowIntensity;
  linkedRoutes: {
    replay?: string;
    passport?: string;
  };
  glyph?: string; // Optional character/symbol displayed on the star
  visibility: UraiMemoryVisibility;
  sourceLayerId: string; // The system or feature that generated this memory
}

// The first memory a user encounters, representing the start of their journey.
export const thresholdGateMemory: UraiMemory = {
  id: "genesis-threshold-gate",
  title: "Threshold Gate",
  subtitle: "The journey begins",
  description: "You have arrived. A new world of memory and reflection awaits. This is the beginning of your journey with URAI.",
  type: "milestone",
  emotionalState: "luminous",
  symbolicState: "threshold_gate",
  replayAvailable: false,
  passportAvailable: false,
  createdAt: new Date().toISOString(),
  constellationPosition: { x: 50, y: 50 },
  glowIntensity: "threshold",
  linkedRoutes: {},
  glyph: " ", // Threshold gates are visually distinct and don't use a glyph
  visibility: "public",
  sourceLayerId: "system_init",
};

/**
 * A local, mock dataset of user memories.
 * In a real application, this would be fetched from a database like Firestore.
 * We start with just the initial Threshold Gate memory to avoid a "fake demo" feel.
 */
const userMemories: UraiMemory[] = [
  thresholdGateMemory,
];

/**
 * Simulates fetching the user's memories from a remote data source.
 * @returns A promise that resolves to an array of URAI memories.
 */
export const getUraiMemories = async (): Promise<UraiMemory[]> => {
  // In a real app, this would be a Firestore query.
  // For now, we simulate a network delay and return our mock data.
  await new Promise(resolve => setTimeout(resolve, 100));
  return userMemories;
};
