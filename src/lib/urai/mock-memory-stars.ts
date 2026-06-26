export type MemoryStarType =
  | "memory"
  | "recovery"
  | "purpose"
  | "joy"
  | "shadow"
  | "relationship"
  | "threshold";

export type MemoryStar = {
  id: string;
  label: string;
  subtitle: string;
  type: MemoryStarType;
  x: number;
  y: number;
  z: number;
  intensity: number;
  color: string;
  narratorLine: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  posterUrl?: string;
  filmTitle?: string;
  filmLogline?: string;
  filmBeats?: string[];
};

const previewBeats = [
  "Select the real source moments before rendering.",
  "Attach user-owned media or generated metadata.",
  "Keep narration as text until audio exists.",
  "Show the finished clip only after a render job completes.",
];

export const mockMemoryStars: MemoryStar[] = [
  {
    id: "memory-001",
    label: "Preview Signal",
    subtitle: "Sample memory star used to demonstrate the film surface.",
    type: "memory",
    x: 22,
    y: 44,
    z: 1,
    intensity: 0.72,
    color: "#f8d98b",
    narratorLine: "This preview shows where a short reflection can appear once a real memory is selected.",
    filmTitle: "Preview Film: Signal Chapter",
    filmLogline: "A sample chapter frame showing how a chosen moment could become a film once real media is connected.",
    filmBeats: previewBeats,
  },
  {
    id: "memory-002",
    label: "Preview Recovery Thread",
    subtitle: "Sample recovery star for launch preview only.",
    type: "recovery",
    x: 48,
    y: 32,
    z: 2,
    intensity: 0.88,
    color: "#71d1c4",
    narratorLine: "This preview keeps recovery language gentle until the user chooses what belongs in the story.",
    filmTitle: "Preview Film: Recovery Thread",
    filmLogline: "A sample recovery chapter frame, not a rendered user memory.",
    filmBeats: previewBeats,
  },
  {
    id: "memory-003",
    label: "Preview Purpose Flare",
    subtitle: "Sample direction star for the cinematic layout.",
    type: "purpose",
    x: 66,
    y: 55,
    z: 3,
    intensity: 0.94,
    color: "#b9a7ff",
    narratorLine: "This is a placeholder cue for how URAI can summarize a chosen purpose moment later.",
    filmTitle: "Preview Film: Purpose Flare",
    filmLogline: "A sample purpose chapter frame awaiting real user-selected moments.",
    filmBeats: previewBeats,
  },
  {
    id: "memory-004",
    label: "Preview Joy Bloom",
    subtitle: "Sample bright point for film-card spacing and motion.",
    type: "joy",
    x: 78,
    y: 38,
    z: 2,
    intensity: 0.81,
    color: "#ffd27a",
    narratorLine: "This preview shows how a joyful memory could be held without inventing the user's experience.",
    filmTitle: "Preview Film: Joy Bloom",
    filmLogline: "A sample bright chapter frame awaiting real media.",
    filmBeats: previewBeats,
  },
  {
    id: "memory-005",
    label: "Preview Shadow Crossing",
    subtitle: "Sample difficult-passage star with safe language.",
    type: "shadow",
    x: 35,
    y: 68,
    z: 1,
    intensity: 0.65,
    color: "#8fd7ff",
    narratorLine: "This preview keeps sensitive material behind consent until the user chooses what to include.",
    filmTitle: "Preview Film: Shadow Crossing",
    filmLogline: "A sample shadow chapter frame; no private passage is inferred or generated.",
    filmBeats: previewBeats,
  },
  {
    id: "memory-006",
    label: "Preview Threshold Gate",
    subtitle: "Sample before-and-after structure for a future film.",
    type: "threshold",
    x: 58,
    y: 72,
    z: 3,
    intensity: 0.9,
    color: "#ff9fbf",
    narratorLine: "This preview marks where a user-chosen threshold could be shaped into a chapter.",
    filmTitle: "Preview Film: Threshold Gate",
    filmLogline: "A sample threshold chapter frame awaiting real source moments.",
    filmBeats: previewBeats,
  },
  {
    id: "memory-007",
    label: "Preview Bond Echo",
    subtitle: "Sample relationship star; real relationship data stays gated.",
    type: "relationship",
    x: 18,
    y: 62,
    z: 2,
    intensity: 0.76,
    color: "#c4f1ff",
    narratorLine: "This preview does not infer anything about real relationships until that layer is opened by the user.",
    filmTitle: "Preview Film: Bond Echo",
    filmLogline: "A sample relationship chapter frame with no live relationship data attached.",
    filmBeats: previewBeats,
  },
];
