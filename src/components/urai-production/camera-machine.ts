import type { CameraPhase, CameraPhaseDefinition, MemoryStar } from "./types";

export const cinematicEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const softEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const ritualEase: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const cameraPhases: Record<CameraPhase, CameraPhaseDefinition> = {
  idle: {
    phase: "idle",
    transform: { scale: 1, x: 0, y: 0, blur: 0, opacity: 1, depth: 0 },
    durationMs: 0,
    easing: cinematicEase,
    interactionLocked: false,
    narratorEligible: true,
    gestureEnabled: true,
    next: ["preAscent"],
  },
  preAscent: {
    phase: "preAscent",
    transform: { scale: 0.97, x: 0, y: 18, blur: 0.5, opacity: 1, depth: 8 },
    durationMs: 420,
    easing: cinematicEase,
    interactionLocked: true,
    narratorEligible: true,
    gestureEnabled: false,
    next: ["ascending", "idle"],
  },
  ascending: {
    phase: "ascending",
    transform: { scale: 1.18, x: 0, y: 220, blur: 1.5, opacity: 1, depth: 42 },
    durationMs: 1900,
    easing: cinematicEase,
    interactionLocked: true,
    narratorEligible: true,
    gestureEnabled: false,
    next: ["lifeMap"],
  },
  lifeMap: {
    phase: "lifeMap",
    transform: { scale: 1, x: 0, y: 0, blur: 0, opacity: 1, depth: 64 },
    durationMs: 720,
    easing: softEase,
    interactionLocked: false,
    narratorEligible: true,
    gestureEnabled: true,
    next: ["focusing", "replayIntro", "returningHome"],
  },
  focusing: {
    phase: "focusing",
    transform: { scale: 2.4, x: 0, y: 0, blur: 0.8, opacity: 1, depth: 96 },
    durationMs: 1050,
    easing: cinematicEase,
    interactionLocked: true,
    narratorEligible: true,
    gestureEnabled: false,
    next: ["focusedMemory", "lifeMap"],
  },
  focusedMemory: {
    phase: "focusedMemory",
    transform: { scale: 1, x: 0, y: 0, blur: 0, opacity: 1, depth: 110 },
    durationMs: 520,
    easing: softEase,
    interactionLocked: false,
    narratorEligible: true,
    gestureEnabled: true,
    next: ["lifeMap", "replayIntro"],
  },
  replayIntro: {
    phase: "replayIntro",
    transform: { scale: 1.12, x: 0, y: 0, blur: 0.5, opacity: 1, depth: 80 },
    durationMs: 900,
    easing: cinematicEase,
    interactionLocked: true,
    narratorEligible: true,
    gestureEnabled: false,
    next: ["replaying", "lifeMap"],
  },
  replaying: {
    phase: "replaying",
    transform: { scale: 1.32, x: 0, y: 0, blur: 0, opacity: 1, depth: 100 },
    durationMs: 0,
    easing: cinematicEase,
    interactionLocked: false,
    narratorEligible: true,
    gestureEnabled: true,
    next: ["replayPaused", "replayExit", "focusedMemory"],
  },
  replayPaused: {
    phase: "replayPaused",
    transform: { scale: 1.28, x: 0, y: 0, blur: 0.5, opacity: 1, depth: 100 },
    durationMs: 240,
    easing: softEase,
    interactionLocked: false,
    narratorEligible: false,
    gestureEnabled: true,
    next: ["replaying", "replayExit", "focusedMemory"],
  },
  replayExit: {
    phase: "replayExit",
    transform: { scale: 1, x: 0, y: 0, blur: 0, opacity: 1, depth: 64 },
    durationMs: 700,
    easing: cinematicEase,
    interactionLocked: true,
    narratorEligible: false,
    gestureEnabled: false,
    next: ["lifeMap"],
  },
  returningHome: {
    phase: "returningHome",
    transform: { scale: 1, x: 0, y: 0, blur: 0, opacity: 1, depth: 0 },
    durationMs: 1150,
    easing: ritualEase,
    interactionLocked: true,
    narratorEligible: true,
    gestureEnabled: false,
    next: ["idle"],
  },
};

export function canTransition(from: CameraPhase, to: CameraPhase) {
  return cameraPhases[from].next.includes(to);
}

export function cameraTransformForFocus(star: MemoryStar) {
  const x = (50 - star.x) * 10;
  const y = (50 - star.y) * 7;
  return {
    scale: 2.4,
    x,
    y,
    blur: 0.8,
    opacity: 1,
    depth: 96,
  };
}
