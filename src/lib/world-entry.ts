import { SCENE_VIBES, type SceneVibe } from "@/lib/scene-generator";

export type WorldEntryState =
  | { kind: "quiet" }
  | { kind: "memory"; memory: string; vibe: SceneVibe }
  | { kind: "default" };

type SearchValue = string | string[] | undefined;

function firstParam(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanMemory(value: string | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, 240);
}

function parseVibe(value: string | undefined): SceneVibe {
  return SCENE_VIBES.includes(value as SceneVibe) ? (value as SceneVibe) : "cinematic";
}

export function parseWorldEntryState(searchParams?: Record<string, SearchValue>): WorldEntryState {
  const mode = firstParam(searchParams?.mode);
  const memory = cleanMemory(firstParam(searchParams?.memory));

  if (memory) {
    return {
      kind: "memory",
      memory,
      vibe: parseVibe(firstParam(searchParams?.vibe)),
    };
  }

  if (mode === "quiet") {
    return { kind: "quiet" };
  }

  return { kind: "default" };
}
