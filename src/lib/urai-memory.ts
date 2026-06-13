
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import { UraiMemory, UraiMemoryType, UraiEmotionalState, UraiGlowIntensity, UraiMemoryVisibility } from '@/lib/urai/types';

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
 * Fetches the user's memories from Firestore.
 * @returns A promise that resolves to an array of URAI memories.
 */
export const getUraiMemories = async (): Promise<UraiMemory[]> => {
  try {
    const memoriesCollection = collection(db, 'memories');
    const memorySnapshot = await getDocs(memoriesCollection);
    const memories = memorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UraiMemory[];

    // Always include the initial Threshold Gate memory
    return [thresholdGateMemory, ...memories];
  } catch (error) {
    console.error("Error fetching memories from Firestore:", error);
    // Return the default threshold gate memory in case of an error
    return [thresholdGateMemory];
  }
};
