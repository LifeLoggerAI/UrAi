import type { LifeMapMode, MemoryStar, MemoryStarType, MemoryStarVisual, PrivacyLevel, PrivacyRenderBehavior, Vector3D } from "./types";
import { starTypeNarratorLines } from "./narrator-lines";

const visuals: Record<MemoryStarType, MemoryStarVisual> = {
  memory: { color: "#dbeafe", glowIntensity: 0.72, particleTrail: "silver dust", haloShape: "soft", pulseSpeed: 0.82, clickAnimation: "soft bloom", hoverState: "label lift", narratorLine: starTypeNarratorLines.memory, constellationBehavior: "connect by repeated timestamp patterns" },
  ritual: { color: "#c4b5fd", glowIntensity: 0.84, particleTrail: "lavender sparks", haloShape: "ring", pulseSpeed: 0.66, clickAnimation: "ritual ripple", hoverState: "halo expansion", narratorLine: starTypeNarratorLines.ritual, constellationBehavior: "anchors recovery lines" },
  relationship: { color: "#f9a8d4", glowIntensity: 0.78, particleTrail: "orbit motes", haloShape: "ring", pulseSpeed: 0.74, clickAnimation: "orbital pull", hoverState: "orbit reveal", narratorLine: starTypeNarratorLines.relationship, constellationBehavior: "attracts relationship bodies" },
  threshold: { color: "#fbbf24", glowIntensity: 1.05, particleTrail: "gold crossings", haloShape: "flame", pulseSpeed: 0.55, clickAnimation: "crossing flare", hoverState: "gate shimmer", narratorLine: starTypeNarratorLines.threshold, constellationBehavior: "forms crossing gates" },
  recovery: { color: "#86efac", glowIntensity: 0.96, particleTrail: "green gold path", haloShape: "crescent", pulseSpeed: 0.68, clickAnimation: "path brighten", hoverState: "path preview", narratorLine: starTypeNarratorLines.recovery, constellationBehavior: "draws recovery pathways" },
  dream: { color: "#c084fc", glowIntensity: 0.88, particleTrail: "violet clouds", haloShape: "soft", pulseSpeed: 0.48, clickAnimation: "dream drift", hoverState: "symbol fog", narratorLine: starTypeNarratorLines.dream, constellationBehavior: "floats through dream fields" },
  mirror: { color: "#f8fafc", glowIntensity: 1.12, particleTrail: "mirror sparks", haloShape: "mirror", pulseSpeed: 0.62, clickAnimation: "reflection flash", hoverState: "mirror glint", narratorLine: starTypeNarratorLines.mirror, constellationBehavior: "reflects identity insights" },
  shadow: { color: "#64748b", glowIntensity: 0.38, particleTrail: "dim smoke", haloShape: "soft", pulseSpeed: 0.32, clickAnimation: "shadow pulse", hoverState: "protective dim", narratorLine: starTypeNarratorLines.shadow, constellationBehavior: "clusters unresolved loops" },
  legacy: { color: "#facc15", glowIntensity: 0.9, particleTrail: "ancestral thread", haloShape: "ancestral", pulseSpeed: 0.58, clickAnimation: "gold thread", hoverState: "legacy reveal", narratorLine: starTypeNarratorLines.legacy, constellationBehavior: "threads lineage memories" },
  joy: { color: "#fde68a", glowIntensity: 1, particleTrail: "warm sparks", haloShape: "ring", pulseSpeed: 1.05, clickAnimation: "joy burst", hoverState: "warmth lift", narratorLine: starTypeNarratorLines.joy, constellationBehavior: "brightens nearby stars" },
  grief: { color: "#bfe9ff", glowIntensity: 0.92, particleTrail: "blue fog", haloShape: "soft", pulseSpeed: 0.42, clickAnimation: "blue fog bloom", hoverState: "gentle hold", narratorLine: starTypeNarratorLines.grief, constellationBehavior: "softens grief threads" },
  purpose: { color: "#67e8f9", glowIntensity: 0.86, particleTrail: "cyan vector", haloShape: "mirror", pulseSpeed: 0.7, clickAnimation: "purpose line", hoverState: "direction glow", narratorLine: starTypeNarratorLines.purpose, constellationBehavior: "points toward becoming" },
  companion: { color: "#93c5fd", glowIntensity: 0.82, particleTrail: "companion orbit", haloShape: "crescent", pulseSpeed: 0.76, clickAnimation: "companion pulse", hoverState: "nearby whisper", narratorLine: starTypeNarratorLines.companion, constellationBehavior: "stays near important memories" },
  rebirth: { color: "#fb7185", glowIntensity: 1.25, particleTrail: "supernova bloom", haloShape: "flame", pulseSpeed: 0.9, clickAnimation: "rebirth supernova", hoverState: "blooming aura", narratorLine: starTypeNarratorLines.rebirth, constellationBehavior: "reshapes local clusters" },
};

export function mapEmotionToColor(tags: string[]): string {
  const joined = tags.join(" ").toLowerCase();
  if (joined.includes("grief")) return "#bfe9ff";
  if (joined.includes("stress") || joined.includes("conflict")) return "#fb923c";
  if (joined.includes("dream")) return "#c084fc";
  if (joined.includes("identity") || joined.includes("mirror")) return "#f8fafc";
  if (joined.includes("legacy")) return "#facc15";
  if (joined.includes("joy")) return "#fde68a";
  if (joined.includes("recovery")) return "#86efac";
  return "#dbeafe";
}

export function mapStarTypeToVisual(type: MemoryStarType): MemoryStarVisual {
  return visuals[type];
}

export function mapIntensityToGlow(intensity: number): number {
  return Math.max(0.18, Math.min(1.35, 0.3 + intensity * 1.05));
}

export function mapRecoveryToPathState(recoveryScore: number): "forming" | "active" | "stabilizing" | "complete" {
  if (recoveryScore < 0.3) return "forming";
  if (recoveryScore < 0.62) return "active";
  if (recoveryScore < 0.88) return "stabilizing";
  return "complete";
}

export function mapRelationshipStrengthToOrbit(strength: number): number {
  return Math.max(1.4, 5.4 - strength * 3.8);
}

export function mapMemoryToPosition(memory: MemoryStar, mode: LifeMapMode): Vector3D {
  const p = memory.position3D;
  if (mode === "relationshipGalaxy") return { x: p.x * 0.75, y: p.y, z: p.z + 0.7 };
  if (mode === "dreamPlanetarium") return { x: p.x, y: p.y + 0.8, z: p.z - 0.35 };
  if (mode === "shadowRealm") return { x: p.x * 0.92, y: p.y - 0.7, z: p.z - 0.8 };
  if (mode === "mirrorOfBecoming") return { x: -p.x, y: p.y, z: p.z };
  if (mode === "legacyUniverse") return { x: p.x * 1.1, y: p.y + 0.25, z: p.z + 0.45 };
  if (mode === "spatialARVR") return { x: p.x * 1.4, y: p.y * 1.2, z: p.z * 1.4 };
  return p;
}

export function mapPrivacyToRenderBehavior(privacyLevel: PrivacyLevel): PrivacyRenderBehavior {
  if (privacyLevel === "localOnly") return { visible: true, blur: false, exportable: false, localOnly: true, label: "Local only" };
  if (privacyLevel === "blurred") return { visible: true, blur: true, exportable: false, localOnly: false, label: "Blurred" };
  if (privacyLevel === "shareable") return { visible: true, blur: false, exportable: true, localOnly: false, label: "Shareable" };
  if (privacyLevel === "legacy") return { visible: true, blur: false, exportable: true, localOnly: false, label: "Legacy" };
  return { visible: true, blur: false, exportable: false, localOnly: false, label: "Private" };
}
