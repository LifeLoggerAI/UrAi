import type { MemoryStar, MemoryStarType, NarratorState } from "./types";

export const narratorStateLabels: Record<NarratorState, string> = {
  calm: "Calm Companion",
  reflective: "Reflective Companion",
  protective: "Protective Companion",
  celebratory: "Celebratory Companion",
  "grief-softened": "Grief-Softened Companion",
  dreamlike: "Dreamlike Companion",
  threshold: "Threshold Companion",
  recovery: "Recovery Companion",
  mirror: "Mirror Companion",
};

export const starTypeNarratorLines: Record<MemoryStarType, string> = {
  memory: "This star belongs to a season of becoming.",
  ritual: "This ritual became a small anchor in the wider sky.",
  relationship: "This relationship has moved closer in your orbit.",
  threshold: "This was not just a memory. It became a crossing.",
  recovery: "A recovery path is forming near this cluster.",
  dream: "A dream-symbol is blooming softly in the violet field.",
  mirror: "URAI is reflecting this identity insight back as mirror light.",
  shadow: "You returned to this pattern more than once. That matters.",
  legacy: "This moment is threading into the gold ancestral layer.",
  joy: "This star kept its warmth because joy left a visible trace.",
  grief: "This grief stayed blue because it asked to be held gently.",
  purpose: "This star belongs to a season of becoming.",
  companion: "Your companion stayed near this memory for a reason.",
  rebirth: "A breakthrough became bright enough to reshape the nearby sky.",
};

export const narratorLines = [
  "This memory carried weight, so URAI rendered it softly.",
  "This thread appears often before recovery begins.",
  "This relationship has moved closer in your orbit.",
  "This star belongs to a season of becoming.",
  "You returned to this pattern more than once. That matters.",
  "This grief stayed blue because it asked to be held gently.",
  "A recovery path is forming near this cluster.",
  "This was not just a memory. It became a crossing.",
];

export function narratorStateForStar(star?: MemoryStar): NarratorState {
  if (!star) return "calm";
  if (star.type === "grief") return "grief-softened";
  if (star.type === "dream") return "dreamlike";
  if (star.type === "threshold") return "threshold";
  if (star.type === "recovery") return "recovery";
  if (star.type === "mirror") return "mirror";
  if (star.type === "shadow") return "protective";
  if (star.type === "joy" || star.type === "rebirth") return "celebratory";
  return "reflective";
}

export function getNarratorLineForTags(star?: MemoryStar): string {
  if (!star) return "URAI is listening for the next meaningful pattern.";
  return star.narratorText || starTypeNarratorLines[star.type] || narratorLines[0];
}
