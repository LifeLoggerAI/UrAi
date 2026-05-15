import type { HomeVisualState, LifeMapNodeType } from "@/lib/use-urai-home-state";

export type UraiVisualLayer = {
  id: string;
  kind: "procedural" | "image" | "svg" | "lottie" | "rive";
  slot: "sky" | "fog" | "silhouette" | "aura" | "orb" | "ground" | "star" | "glyph" | "transition";
  src?: string;
  fallbackClass: string;
  zIndex: number;
  opacity?: number;
  blendMode?: "normal" | "screen" | "overlay" | "soft-light" | "plus-lighter";
  transform?: string;
};

export type UraiVisualScene = {
  id: string;
  label: string;
  layers: UraiVisualLayer[];
};

export const URAI_ASSET_ROOT = "/assets/urai";

export const URAI_ASSET_CONVENTIONS = {
  sceneSize: "1440x3120",
  transparentOverlayFormat: "png",
  webFormat: "webp",
  svgGlyphPath: `${URAI_ASSET_ROOT}/glyphs`,
  requiredFolders: [
    `${URAI_ASSET_ROOT}/sky`,
    `${URAI_ASSET_ROOT}/fog`,
    `${URAI_ASSET_ROOT}/silhouette`,
    `${URAI_ASSET_ROOT}/aura`,
    `${URAI_ASSET_ROOT}/orb`,
    `${URAI_ASSET_ROOT}/ground`,
    `${URAI_ASSET_ROOT}/stars`,
    `${URAI_ASSET_ROOT}/glyphs`,
    `${URAI_ASSET_ROOT}/transitions`,
  ],
} as const;

const sceneLayers = (state: HomeVisualState): UraiVisualLayer[] => [
  { id: `${state}-sky`, kind: "image", slot: "sky", src: `${URAI_ASSET_ROOT}/sky/${state}-sky-1440x3120.webp`, fallbackClass: "sky-gradient", zIndex: 0, opacity: 1 },
  { id: `${state}-aurora`, kind: "image", slot: "fog", src: `${URAI_ASSET_ROOT}/fog/${state}-aurora-overlay-1440x3120.png`, fallbackClass: "distant-aurora", zIndex: 1, opacity: 0.68, blendMode: "screen" },
  { id: `${state}-fog-a`, kind: "image", slot: "fog", src: `${URAI_ASSET_ROOT}/fog/${state}-fog-a-1440x3120.png`, fallbackClass: "sky-fog sky-fog-one", zIndex: 2, opacity: 0.7, blendMode: "screen" },
  { id: `${state}-fog-b`, kind: "image", slot: "fog", src: `${URAI_ASSET_ROOT}/fog/${state}-fog-b-1440x3120.png`, fallbackClass: "sky-fog sky-fog-two", zIndex: 3, opacity: 0.5, blendMode: "screen" },
  { id: `${state}-horizon`, kind: "image", slot: "ground", src: `${URAI_ASSET_ROOT}/ground/${state}-horizon-1440x3120.png`, fallbackClass: "horizon-glow", zIndex: 4, opacity: 0.9, blendMode: "screen" },
  { id: `${state}-silhouette`, kind: "image", slot: "silhouette", src: `${URAI_ASSET_ROOT}/silhouette/${state}-body-1440x3120.png`, fallbackClass: "procedural-silhouette", zIndex: 20, opacity: 0.76 },
  { id: `${state}-aura`, kind: "image", slot: "aura", src: `${URAI_ASSET_ROOT}/aura/${state}-aura-1440x3120.png`, fallbackClass: "aura-field", zIndex: 23, opacity: 0.88, blendMode: "screen" },
  { id: `${state}-orb", kind: "image", slot: "orb", src: `${URAI_ASSET_ROOT}/orb/${state}-orb-1024.png`, fallbackClass: "procedural-orb", zIndex: 25, opacity: 1 },
];

export const URAI_HOME_VISUAL_SCENES: Record<HomeVisualState, UraiVisualScene> = {
  calm: { id: "calm", label: "Calm Field", layers: sceneLayers("calm") },
  focused: { id: "focused", label: "Focused Field", layers: sceneLayers("focused") },
  overstimulated: { id: "overstimulated", label: "Fast Rhythm Field", layers: sceneLayers("overstimulated") },
  offRhythm: { id: "offRhythm", label: "Recalibration Field", layers: sceneLayers("offRhythm") },
  recovery: { id: "recovery", label: "Recovery Bloom Field", layers: sceneLayers("recovery") },
  threshold: { id: "threshold", label: "Threshold Protection Field", layers: sceneLayers("threshold") },
  socialHigh: { id: "socialHigh", label: "Social Glow Field", layers: sceneLayers("socialHigh") },
  socialSilence: { id: "socialSilence", label: "Social Silence Field", layers: sceneLayers("socialSilence") },
  empty: { id: "empty", label: "Empty Listening Field", layers: sceneLayers("empty") },
};

export const URAI_NODE_GLYPHS: Record<LifeMapNodeType, string> = {
  memory: `${URAI_ASSET_ROOT}/glyphs/memory.svg`,
  ritual: `${URAI_ASSET_ROOT}/glyphs/ritual.svg`,
  relationship: `${URAI_ASSET_ROOT}/glyphs/relationship.svg`,
  forecast: `${URAI_ASSET_ROOT}/glyphs/forecast.svg`,
  recovery: `${URAI_ASSET_ROOT}/glyphs/recovery.svg`,
  threshold: `${URAI_ASSET_ROOT}/glyphs/threshold.svg`,
  becoming: `${URAI_ASSET_ROOT}/glyphs/becoming.svg`,
  dream: `${URAI_ASSET_ROOT}/glyphs/dream.svg`,
  mirror: `${URAI_ASSET_ROOT}/glyphs/mirror.svg`,
  breakthrough: `${URAI_ASSET_ROOT}/glyphs/breakthrough.svg`,
  warning: `${URAI_ASSET_ROOT}/glyphs/warning.svg`,
  legacy: `${URAI_ASSET_ROOT}/glyphs/legacy.svg`,
};

export function getUraiHomeVisualScene(state: HomeVisualState) {
  return URAI_HOME_VISUAL_SCENES[state] ?? URAI_HOME_VISUAL_SCENES.calm;
}
