export type SceneVibe = "cinematic" | "calm" | "strange" | "dark" | "hopeful";

export type GeneratedScene = {
  id: string;
  memory: string;
  vibe: SceneVibe;
  title: string;
  atmosphere: string;
  world: string;
  narratorLine: string;
  nextPrompt: string;
  posterPrompt: string;
};

const VIBE_COPY: Record<SceneVibe, { atmosphere: string; lens: string; light: string }> = {
  cinematic: {
    atmosphere: "wide, luminous, and cinematic",
    lens: "a slow tracking shot with emotional scale",
    light: "blue-gold light cutting through soft haze"
  },
  calm: {
    atmosphere: "quiet, grounded, and breathable",
    lens: "a still frame that lets the moment settle",
    light: "warm window light and slow moving shadows"
  },
  strange: {
    atmosphere: "surreal, symbolic, and half-dreamed",
    lens: "a drifting camera moving through impossible architecture",
    light: "violet reflections, floating dust, and bent neon"
  },
  dark: {
    atmosphere: "heavy, intimate, and storm-lit",
    lens: "a close handheld scene with pressure under the surface",
    light: "low contrast light, rain shine, and a distant amber glow"
  },
  hopeful: {
    atmosphere: "open, rebuilding, and quietly triumphant",
    lens: "a rising shot from ground level into a wider world",
    light: "sunrise color, clean air, and reflective glass"
  }
};

function normalizeMemory(memory: string) {
  return memory.replace(/\s+/g, " ").trim().slice(0, 900);
}

function titleFromMemory(memory: string, vibe: SceneVibe) {
  const clean = normalizeMemory(memory);
  const firstClause = clean.split(/[.!?;:]/)[0]?.trim() || "A memory becomes visible";
  const short = firstClause.length > 58 ? `${firstClause.slice(0, 55).trim()}...` : firstClause;
  const prefixes: Record<SceneVibe, string> = {
    cinematic: "The Scene Where",
    calm: "The Quiet Place Where",
    strange: "The Door That Remembered",
    dark: "The Room Beneath",
    hopeful: "The World After"
  };
  return `${prefixes[vibe]} ${short.charAt(0).toLowerCase()}${short.slice(1)}`;
}

function base64UrlEncode(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }
  if (typeof window !== "undefined") {
    return window.btoa(unescape(encodeURIComponent(value))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  return encodeURIComponent(value);
}

export function decodeSceneId(id: string): GeneratedScene | null {
  try {
    const normalized = id.replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof Buffer !== "undefined"
      ? Buffer.from(normalized, "base64").toString("utf8")
      : decodeURIComponent(escape(window.atob(normalized)));
    const parsed = JSON.parse(json) as GeneratedScene;
    if (!parsed?.memory || !parsed?.title) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function encodeScene(scene: GeneratedScene) {
  return base64UrlEncode(JSON.stringify(scene));
}

export function generateScene(memoryInput: string, vibe: SceneVibe = "cinematic"): GeneratedScene {
  const memory = normalizeMemory(memoryInput) || "A person gives URAI one small piece of their life and watches it become visible.";
  const copy = VIBE_COPY[vibe];
  const title = titleFromMemory(memory, vibe);
  const atmosphere = `The scene feels ${copy.atmosphere}: ${copy.light}.`;
  const world = `URAI treats this memory like the first room of an autonomous world. The environment forms around the emotional center of the moment, then leaves space for the next memory to expand the place, the characters, and the story.`;
  const narratorLine = `This is where your life stops being a note and starts becoming a world.`;
  const nextPrompt = "Add another memory to grow the world.";
  const posterPrompt = `Poster still for a personal cinematic world: ${memory}. ${copy.lens}, ${copy.light}, intimate scale, atmospheric detail, no text.`;

  return {
    id: "draft",
    memory,
    vibe,
    title,
    atmosphere,
    world,
    narratorLine,
    nextPrompt,
    posterPrompt
  };
}

export const SCENE_VIBES: SceneVibe[] = ["cinematic", "calm", "strange", "dark", "hopeful"];
