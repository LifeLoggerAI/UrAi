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

export const mockMemoryStars: MemoryStar[] = [
  {
    id: "memory-001",
    label: "First Signal",
    subtitle: "The moment the pattern became visible.",
    type: "memory",
    x: 22,
    y: 44,
    z: 1,
    intensity: 0.72,
    color: "#f8d98b",
    narratorLine: "This was the first small light that told you the story was beginning.",
    filmTitle: "First Signal: Origin Chapter",
    filmLogline: "A first pattern appears and turns a raw moment into the beginning of a life movie.",
    filmBeats: ["Open on the real image inside the star.", "Push through the glow into reconstructed context.", "Let the narrator name what changed.", "Pull back to reveal the chapter saved inside the galaxy."],
  },
  {
    id: "memory-002",
    label: "Recovery Thread",
    subtitle: "A return after pressure.",
    type: "recovery",
    x: 48,
    y: 32,
    z: 2,
    intensity: 0.88,
    color: "#71d1c4",
    narratorLine: "You did not return unchanged. You returned with a new map.",
    filmTitle: "Recovery Thread: Return Chapter",
    filmLogline: "A pressure cycle resolves into a new route back through the self.",
    filmBeats: ["Open with the heaviest captured media.", "Show the pressure field breaking.", "Crossfade into the recovery signal.", "End on the new map forming."],
  },
  {
    id: "memory-003",
    label: "Purpose Flare",
    subtitle: "A direction started glowing.",
    type: "purpose",
    x: 66,
    y: 55,
    z: 3,
    intensity: 0.94,
    color: "#b9a7ff",
    narratorLine: "Purpose did not arrive as certainty. It arrived as a flare.",
    filmTitle: "Purpose Flare: Direction Chapter",
    filmLogline: "A small signal becomes a visible direction.",
    filmBeats: ["Begin in low light.", "Reveal the first violet flare.", "Track the decision path.", "End with the direction glowing ahead."],
  },
  {
    id: "memory-004",
    label: "Joy Bloom",
    subtitle: "A bright point in the field.",
    type: "joy",
    x: 78,
    y: 38,
    z: 2,
    intensity: 0.81,
    color: "#ffd27a",
    narratorLine: "Joy gathered here, not loudly, but clearly enough to be remembered.",
    filmTitle: "Joy Bloom: Bright Chapter",
    filmLogline: "A small bright moment becomes worth saving as a scene.",
    filmBeats: ["Open with warmth.", "Let the image breathe.", "Add motion from ambient context.", "Close on the bloom becoming a star."],
  },
  {
    id: "memory-005",
    label: "Shadow Crossing",
    subtitle: "A difficult passage became part of the map.",
    type: "shadow",
    x: 35,
    y: 68,
    z: 1,
    intensity: 0.65,
    color: "#8fd7ff",
    narratorLine: "This crossing was not the end of the path. It became one of its markings.",
    filmTitle: "Shadow Crossing: Passage Chapter",
    filmLogline: "A hard passage is transformed into navigable memory instead of noise.",
    filmBeats: ["Open in blue shadow.", "Move through the difficult scene carefully.", "Mark the lesson without glorifying pain.", "Exit into the map."],
  },
  {
    id: "memory-006",
    label: "Threshold Gate",
    subtitle: "A before and after moment.",
    type: "threshold",
    x: 58,
    y: 72,
    z: 3,
    intensity: 0.9,
    color: "#ff9fbf",
    narratorLine: "A threshold does not ask for permission. It opens when life is ready to divide.",
    filmTitle: "Threshold Gate: Before After Chapter",
    filmLogline: "A life moment splits the world into before and after.",
    filmBeats: ["Open before the gate.", "Show the dividing moment.", "Cross the threshold.", "Reveal the changed world."],
  },
  {
    id: "memory-007",
    label: "Bond Echo",
    subtitle: "A relationship left a signal.",
    type: "relationship",
    x: 18,
    y: 62,
    z: 2,
    intensity: 0.76,
    color: "#c4f1ff",
    narratorLine: "Some people become coordinates in the emotional sky.",
    filmTitle: "Bond Echo: Relationship Chapter",
    filmLogline: "A relationship signal becomes a scene with emotional coordinates.",
    filmBeats: ["Open on the connection signal.", "Bring in shared context.", "Trace the emotional echo.", "Leave the bond glowing in the sky."],
  },
];
