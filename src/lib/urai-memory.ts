import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

export type UraiMemoryType =
  | "moment"
  | "reflection"
  | "milestone"
  | "relationship"
  | "place"
  | "ritual"
  | "dream"
  | "system";

export type UraiEmotionalState =
  | "calm"
  | "luminous"
  | "heavy"
  | "storm"
  | "rising"
  | "tender"
  | "unknown";

export type UraiGlowIntensity = "low" | "medium" | "high";

export type UraiMemoryVisibility = "private" | "passport" | "shared";

export type UraiMemory = {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  subtitle?: string;
  sourceLayerId?: string;
  constellationPosition: { x: number; y: number };
  glyph?: string;
  type: UraiMemoryType;
  emotionalState: UraiEmotionalState;
  glowIntensity: UraiGlowIntensity;
  visibility: UraiMemoryVisibility;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

function normalizeMemory(id: string, value: Record<string, unknown>): UraiMemory {
  return {
    id,
    userId: typeof value.userId === "string" ? value.userId : undefined,
    title: typeof value.title === "string" ? value.title : "Untitled memory",
    description: typeof value.description === "string" ? value.description : undefined,
    subtitle: typeof value.subtitle === "string" ? value.subtitle : undefined,
    sourceLayerId: typeof value.sourceLayerId === "string" ? value.sourceLayerId : undefined,
    constellationPosition: typeof value.constellationPosition === "object" && value.constellationPosition !== null ? value.constellationPosition as { x: number; y: number } : { x: 0, y: 0 },
    glyph: typeof value.glyph === "string" ? value.glyph : undefined,
    type: (typeof value.type === "string" ? value.type : "moment") as UraiMemoryType,
    emotionalState: (typeof value.emotionalState === "string" ? value.emotionalState : "unknown") as UraiEmotionalState,
    glowIntensity: (typeof value.glowIntensity === "string" ? value.glowIntensity : "medium") as UraiGlowIntensity,
    visibility: (typeof value.visibility === "string" ? value.visibility : "private") as UraiMemoryVisibility,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
    tags: Array.isArray(value.tags) ? value.tags.filter((item): item is string => typeof item === "string") : [],
    metadata: typeof value.metadata === "object" && value.metadata !== null ? value.metadata as Record<string, unknown> : undefined,
  };
}

export async function getUraiMemories(userId = "demo-user"): Promise<UraiMemory[]> {
  if (!isFirebaseConfigured()) return [];

  try {
    const snapshot = await getDocs(collection(db(), "users", userId, "memories"));
    return snapshot.docs.map((doc) => normalizeMemory(doc.id, doc.data()));
  } catch {
    return [];
  }
}
