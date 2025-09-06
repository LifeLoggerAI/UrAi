
// Types
export type Category =
  | "neutral" | "growth" | "fracture" | "healing" | "cosmic"
  | "bloom" | "shadow" | "energy" | "seasonal";
export type Variant = "a" | "b" | "c" | undefined;
export type Persona = "gentle" | "mythic" | "playful" | "coach";

export type NarrLine = { clipId: string; text: string };
export type VoicePreset = { voice: string; languageCode: string; speakingRate: number; pitch: number };

// ---------- Persona → TTS presets ----------
export const VOICE_PRESETS: Record<Persona, VoicePreset> = {
  gentle: { voice: "en-US-Neural2-C", languageCode: "en-US", speakingRate: 1.00, pitch: 0.0 },
  mythic: { voice: "en-GB-Neural2-B", languageCode: "en-GB", speakingRate: 0.97, pitch: -1.0 },
  playful:{ voice: "en-US-Neural2-D", languageCode: "en-US", speakingRate: 1.06, pitch: 2.0 },
  coach:  { voice: "en-US-Neural2-F", languageCode: "en-US", speakingRate: 1.04, pitch: 1.0 },
};

// ---------- Deterministic random (stable per scene) ----------
function seededRand(seed: string): number {
  // Simple xorshift-ish hash → [0,1)
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2**32;
}
function choice<T>(arr: T[], seed: string): T {
  return arr[Math.floor(seededRand(seed) * arr.length) % arr.length];
}

// ---------- Phrase banks ----------
const INTRO_TEMPLATES: Record<Category, string[]> = {
  neutral: [
    "A calm neutral state surrounds you.",
    "Balance holds steady—neither push nor pull.",
    "A quiet baseline: the story waits to be told."
  ],
  growth: [
    "Growth is taking root in small, steady ways.",
    "Subtle expansion breathes into the scene.",
    "Potential gathers—new pathways unfold."
  ],
  fracture: [
    "Stress lines surface—the truth reveals its edges.",
    "Fractures mark places that asked for care.",
    "Tension maps across the ground like thin lightning."
  ],
  healing: [
    "Restoration begins: soft mending at the seams.",
    "Gentle repair weaves through the moment.",
    "The system remembers how to heal."
  ],
  cosmic: [
    "Cosmic currents hum beneath the ordinary.",
    "Patterns from far beyond ripple through now.",
    "A broader field aligns around you."
  ],
  bloom: [
    "A bloom of renewal spreads outward.",
    "Color returns; vitality stirs and rises.",
    "New life petals open in the present."
  ],
  shadow: [
    "Shadows hint at what remained unspoken.",
    "The unseen asks to be witnessed with care.",
    "Contours of the hidden move beneath the surface."
  ],
  energy: [
    "Energy spikes and vibrates with intent.",
    "Momentum builds—charge in the atmosphere.",
    "A surge asks to be shaped, not resisted."
  ],
  seasonal: [
    "Seasons shift—time leaves luminous markers.",
    "A chapter turns with the rhythm of the year.",
    "The climate of meaning pivots, then settles."
  ],
};

// Variant-specific descriptors (merge with category lines)
const VARIANT_FLAVOR: Record<Exclude<Variant, undefined> | '-', string[]> = {
  "-": [
    "A straightforward expression—unembellished.",
    "The clean read of this moment.",
    "As-is, without ornament."
  ],
  "a": [
    "Version A: brighter highlights, quicker tempo.",
    "A-side—lean and vivid.",
    "Crisp contours with a clear edge."
  ],
  "b": [
    "B-side—warmer and introspective.",
    "Muted palette, longer echoes."
  ],
  "c": [
    "Version C: experimental textures, playful drift.",
    "C-cut—curious and off-axis.",
    "Unexpected accents invite attention."
  ],
};

// Hint lines (interaction prompts)
const HINTS: string[] = [
  "Tap to explore variations, or press R to shuffle the scene.",
  "Try cycling variants—small changes reveal new meaning.",
  "Shift the scene; notice what changes and what stays true."
];

// ---------- Single-layer script (sky OR ground) ----------
export function generateLayerScript(
  layer: "sky" | "ground",
  category: Category,
  index: number,
  variant?: Variant,
  persona: Persona = "gentle"
): { lines: NarrLine[]; preset: VoicePreset } {
  const id = `${layer}-${category}-${String(index).padStart(2, "0")}${variant ?? ""}`;
  const vKey = (variant ?? "-") as keyof typeof VARIANT_FLAVOR;

  const intro = choice(INTRO_TEMPLATES[category], id);
  const flavor = choice(VARIANT_FLAVOR[vKey], id + "|v");
  const hint = choice(HINTS, id + "|h");

  const lines: NarrLine[] = [
    { clipId: `${id}-intro`, text: `${capitalize(layer)} ${category} ${index}${variant ?? ""}. ${intro}` },
    { clipId: `${id}-flavor`, text: flavor },
    { clipId: `${id}-hint`, text: hint }
  ];

  return { lines, preset: VOICE_PRESETS[persona] };
}

// ---------- Combined script (sky + ground) ----------
export function generateCombinedScript(
  sky: { category: Category; index: number; variant?: Variant },
  ground: { category: Category; index: number; variant?: Variant },
  persona: Persona = "gentle"
): { lines: NarrLine[]; preset: VoicePreset } {
  const id = `combo-${sky.category}-${sky.index}${sky.variant ?? ""}__${ground.category}-${ground.index}${ground.variant ?? ""}`;

  const skyIntro = choice(INTRO_TEMPLATES[sky.category], id + "|sky");
  const groundIntro = choice(INTRO_TEMPLATES[ground.category], id + "|ground");

  const skyKey = (sky.variant ?? '-') as keyof typeof VARIANT_FLAVOR;
  const groundKey = (ground.variant ?? '-') as keyof typeof VARIANT_FLAVOR;
  const skyFlavor = choice(VARIANT_FLAVOR[skyKey], id + '|sv');
  const groundFlavor = choice(VARIANT_FLAVOR[groundKey], id + '|gv');

  const hint = choice(HINTS, id + "|h");

  const lines: NarrLine[] = [
    { clipId: `${id}-intro`,
      text: `Sky ${sky.category} ${sky.index}${sky.variant ?? ""} meets Ground ${ground.category} ${ground.index}${ground.variant ?? ""}.` },
    { clipId: `${id}-sky`, text: skyIntro },
    { clipId: `${id}-ground`, text: groundIntro },
    { clipId: `${id}-flavors`, text: `${skyFlavor} ${groundFlavor}` },
    { clipId: `${id}-hint`, text: hint }
  ];

  return { lines, preset: VOICE_PRESETS[persona] };
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
