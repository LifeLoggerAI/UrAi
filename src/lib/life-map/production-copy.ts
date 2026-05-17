import type { LifeMapMode, MemoryStar, MemoryStarType } from "./types";

const typeLabels: Record<MemoryStarType, string> = {
  memory: "Memory",
  ritual: "Ritual anchor",
  relationship: "Relationship orbit",
  threshold: "Threshold moment",
  recovery: "Recovery thread",
  dream: "Dream field",
  mirror: "Mirror insight",
  shadow: "Shadow pattern",
  legacy: "Legacy thread",
  joy: "Joy marker",
  grief: "Grief marker",
  purpose: "Purpose signal",
  companion: "Companion signal",
  rebirth: "Rebirth bloom",
};

export const modeLabels: Record<LifeMapMode, string> = {
  memoryGalaxy: "Memory Galaxy",
  fullLifeUniverse: "Full Life Universe",
  emotionalCosmos: "Emotional Cosmos",
  relationshipGalaxy: "Relationship Galaxy",
  dreamPlanetarium: "Dream Planetarium",
  shadowRealm: "Shadow Realm",
  mirrorOfBecoming: "Mirror of Becoming",
  legacyUniverse: "Legacy Universe",
  spatialARVR: "Spatial AR/VR",
};

export function formatMemoryType(type: MemoryStarType) {
  return typeLabels[type] ?? "Memory star";
}

export function formatMemoryMeta(memory?: MemoryStar) {
  if (!memory) return "privacy-safe summary";
  const glow = typeof memory.glow === "number" ? `${Math.round(memory.glow * 100)}% confidence` : null;
  const signalCount = Array.isArray(memory.sourceSignals) ? memory.sourceSignals.length : 0;
  const signalCopy = signalCount === 1 ? "1 passive signal" : signalCount > 1 ? `${signalCount} passive signals` : null;
  return [glow, signalCopy, "privacy-safe summary"].filter(Boolean).join(" · ");
}

export function companionLineFor(memory?: MemoryStar, state?: "idle" | "focus" | "replay" | "mirror" | "ritual" | "privacy") {
  if (state === "replay") return "Following the thread through time.";
  if (state === "mirror") return "Reflecting this memory without judgment.";
  if (state === "ritual") return "A small ritual can help the thread settle.";
  if (state === "privacy") return "URAI can explain the pattern without exposing the private source.";
  if (!memory) return "Your sky is listening softly.";
  if (memory.type === "threshold") return "This was a crossing point, not a diagnosis.";
  return memory.narratorText || "This memory carried weight, so URAI rendered it softly.";
}

export function canonSafeTitle(value?: string) {
  return value?.trim() || "Untitled memory";
}

export function canonSafeSubtitle(value?: string) {
  return value?.trim() || "passive memory marker";
}
