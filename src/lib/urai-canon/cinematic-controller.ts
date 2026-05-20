import { URAI_ROUTE_TRANSITIONS, type UraiRouteId } from "./system";
import { URAI_CAMERA_PRESETS, type UraiCameraPreset } from "./spatial-runtime";

export type UraiCinematicTransitionId = keyof typeof URAI_ROUTE_TRANSITIONS;

export type UraiCameraVector3 = readonly [number, number, number];

export type UraiCameraFrame = {
  position: UraiCameraVector3;
  target: UraiCameraVector3;
  fov: number;
  bloom: number;
  fog: number;
  starOpacity: number;
  uiOpacity: number;
  inputLocked: boolean;
};

export type UraiCinematicTransitionContract = {
  id: UraiCinematicTransitionId;
  fromRoute: string;
  toRoute: string;
  durationMs: number;
  reducedMotionDurationMs: number;
  startPreset: keyof typeof URAI_CAMERA_PRESETS;
  endPreset: keyof typeof URAI_CAMERA_PRESETS;
  worldAction: string;
  routeCommitAtMs: number;
  inputUnlockAtMs: number;
};

export const URAI_CINEMATIC_TRANSITIONS: Record<UraiCinematicTransitionId, UraiCinematicTransitionContract> = {
  homeToLifeMap: {
    id: "homeToLifeMap",
    fromRoute: "/home",
    toRoute: "/life-map",
    durationMs: 2200,
    reducedMotionDurationMs: 260,
    startPreset: "home",
    endPreset: "lifeMap",
    worldAction: "orb wakes, floor rings respond, camera ascends through mist into personal universe",
    routeCommitAtMs: 900,
    inputUnlockAtMs: 2200,
  },
  lifeMapStarToFocus: {
    id: "lifeMapStarToFocus",
    fromRoute: "/life-map/star/[starId]",
    toRoute: "/focus",
    durationMs: 1700,
    reducedMotionDurationMs: 220,
    startPreset: "lifeMap",
    endPreset: "focus",
    worldAction: "selected star expands into protected focus orb chamber",
    routeCommitAtMs: 620,
    inputUnlockAtMs: 1700,
  },
  focusToReplay: {
    id: "focusToReplay",
    fromRoute: "/focus/session/[sessionId]",
    toRoute: "/replay/[replayId]",
    durationMs: 1800,
    reducedMotionDurationMs: 240,
    startPreset: "focus",
    endPreset: "replay",
    worldAction: "focus orb opens into source-backed replay theater",
    routeCommitAtMs: 700,
    inputUnlockAtMs: 1800,
  },
  replayToFocusEsc: {
    id: "replayToFocusEsc",
    fromRoute: "/replay/[replayId]",
    toRoute: "/focus/session/[sessionId]",
    durationMs: 1200,
    reducedMotionDurationMs: 180,
    startPreset: "replay",
    endPreset: "focus",
    worldAction: "replay evidence chamber closes and focus agency returns",
    routeCommitAtMs: 360,
    inputUnlockAtMs: 1200,
  },
  focusToLifeMapEsc: {
    id: "focusToLifeMapEsc",
    fromRoute: "/focus/session/[sessionId]",
    toRoute: "/life-map",
    durationMs: 1400,
    reducedMotionDurationMs: 200,
    startPreset: "focus",
    endPreset: "lifeMap",
    worldAction: "focus chamber collapses back into original star context",
    routeCommitAtMs: 420,
    inputUnlockAtMs: 1400,
  },
  lifeMapToHome: {
    id: "lifeMapToHome",
    fromRoute: "/life-map",
    toRoute: "/home",
    durationMs: 2200,
    reducedMotionDurationMs: 260,
    startPreset: "lifeMap",
    endPreset: "home",
    worldAction: "cosmic map descends back into grounded sanctuary orb",
    routeCommitAtMs: 900,
    inputUnlockAtMs: 2200,
  },
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec3(a: UraiCameraVector3, b: UraiCameraVector3, t: number): UraiCameraVector3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)] as const;
}

function presetFrame(preset: UraiCameraPreset): UraiCameraFrame {
  return {
    position: preset.position,
    target: preset.target,
    fov: preset.fov,
    bloom: 0.34,
    fog: 0.48,
    starOpacity: 0.72,
    uiOpacity: 1,
    inputLocked: false,
  };
}

export function resolveUraiCameraFrame(transitionId: UraiCinematicTransitionId, elapsedMs: number, reducedMotion = false): UraiCameraFrame {
  const transition = URAI_CINEMATIC_TRANSITIONS[transitionId];
  const start = presetFrame(URAI_CAMERA_PRESETS[transition.startPreset]);
  const end = presetFrame(URAI_CAMERA_PRESETS[transition.endPreset]);
  const duration = reducedMotion ? transition.reducedMotionDurationMs : transition.durationMs;
  const t = easeOutCubic(elapsedMs / duration);

  if (reducedMotion) {
    return { ...end, uiOpacity: elapsedMs >= duration ? 1 : 0.4, inputLocked: elapsedMs < duration };
  }

  return {
    position: lerpVec3(start.position, end.position, t),
    target: lerpVec3(start.target, end.target, t),
    fov: lerp(start.fov, end.fov, t),
    bloom: lerp(start.bloom, transitionId === "focusToReplay" ? 0.72 : 0.46, Math.sin(Math.PI * t)),
    fog: lerp(start.fog, transitionId === "homeToLifeMap" ? 0.76 : 0.52, Math.sin(Math.PI * t)),
    starOpacity: lerp(start.starOpacity, end.starOpacity, t),
    uiOpacity: elapsedMs < transition.routeCommitAtMs ? 1 - t : t,
    inputLocked: elapsedMs < transition.inputUnlockAtMs,
  };
}

export function assertUraiCinematicTransitionIntegrity(): string[] {
  const failures: string[] = [];
  for (const [id, transition] of Object.entries(URAI_CINEMATIC_TRANSITIONS) as Array<[UraiCinematicTransitionId, UraiCinematicTransitionContract]>) {
    if (transition.id !== id) failures.push(`Transition id mismatch: ${id}`);
    if (!URAI_CAMERA_PRESETS[transition.startPreset]) failures.push(`Missing start preset for ${id}`);
    if (!URAI_CAMERA_PRESETS[transition.endPreset]) failures.push(`Missing end preset for ${id}`);
    if (transition.routeCommitAtMs <= 0 || transition.routeCommitAtMs >= transition.durationMs) failures.push(`Invalid route commit timing for ${id}`);
    if (transition.inputUnlockAtMs < transition.routeCommitAtMs) failures.push(`Input unlocks before route commit for ${id}`);
    if (transition.reducedMotionDurationMs > 300) failures.push(`Reduced motion too long for ${id}`);
    if (!transition.worldAction) failures.push(`Missing world action for ${id}`);
  }
  return failures;
}

export function isKnownCinematicRoute(route: UraiRouteId | "/"): boolean {
  return route === "/" || ["/home", "/life-map", "/life-map/star/[starId]", "/focus", "/focus/session/[sessionId]", "/replay", "/replay/[replayId]"].includes(route);
}
