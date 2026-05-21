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

function lastPhase(id: UraiCinematicTransitionId): number {
  const phases = URAI_ROUTE_TRANSITIONS[id].phasesMs;
  return phases[phases.length - 1] ?? 0;
}

export const URAI_CINEMATIC_TRANSITIONS: Record<UraiCinematicTransitionId, UraiCinematicTransitionContract> = {
  homeToLifeMap: {
    id: "homeToLifeMap",
    fromRoute: "/home",
    toRoute: "/life-map",
    durationMs: lastPhase("homeToLifeMap"),
    reducedMotionDurationMs: 260,
    startPreset: "home",
    endPreset: "lifeMap",
    worldAction: "orb wakes, floor rings respond, camera ascends through mist into personal universe",
    routeCommitAtMs: 900,
    inputUnlockAtMs: lastPhase("homeToLifeMap"),
  },
  lifeMapStarToFocus: {
    id: "lifeMapStarToFocus",
    fromRoute: "/life-map/star/[starId]",
    toRoute: "/focus",
    durationMs: lastPhase("lifeMapStarToFocus"),
    reducedMotionDurationMs: 220,
    startPreset: "lifeMap",
    endPreset: "focus",
    worldAction: "selected star expands into protected focus orb chamber",
    routeCommitAtMs: 620,
    inputUnlockAtMs: lastPhase("lifeMapStarToFocus"),
  },
  focusToReplay: {
    id: "focusToReplay",
    fromRoute: "/focus/session/[sessionId]",
    toRoute: "/replay/[replayId]",
    durationMs: lastPhase("focusToReplay"),
    reducedMotionDurationMs: 240,
    startPreset: "focus",
    endPreset: "replay",
    worldAction: "focus orb opens into source-backed replay theater",
    routeCommitAtMs: 700,
    inputUnlockAtMs: lastPhase("focusToReplay"),
  },
  replayToFocusEsc: {
    id: "replayToFocusEsc",
    fromRoute: "/replay/[replayId]",
    toRoute: "/focus/session/[sessionId]",
    durationMs: lastPhase("replayToFocusEsc"),
    reducedMotionDurationMs: 180,
    startPreset: "replay",
    endPreset: "focus",
    worldAction: "replay evidence chamber closes and focus agency returns",
    routeCommitAtMs: 360,
    inputUnlockAtMs: lastPhase("replayToFocusEsc"),
  },
  focusToLifeMapEsc: {
    id: "focusToLifeMapEsc",
    fromRoute: "/focus/session/[sessionId]",
    toRoute: "/life-map",
    durationMs: lastPhase("focusToLifeMapEsc"),
    reducedMotionDurationMs: 200,
    startPreset: "focus",
    endPreset: "lifeMap",
    worldAction: "focus chamber collapses back into original star context",
    routeCommitAtMs: 420,
    inputUnlockAtMs: lastPhase("focusToLifeMapEsc"),
  },
  lifeMapToHome: {
    id: "lifeMapToHome",
    fromRoute: "/life-map",
    toRoute: "/home",
    durationMs: lastPhase("lifeMapToHome"),
    reducedMotionDurationMs: 260,
    startPreset: "lifeMap",
    endPreset: "home",
    worldAction: "cosmic map descends back into grounded sanctuary orb",
    routeCommitAtMs: 900,
    inputUnlockAtMs: lastPhase("lifeMapToHome"),
  },
  homeToOchat: {
    id: "homeToOchat",
    fromRoute: "/home",
    toRoute: "/ochat",
    durationMs: lastPhase("homeToOchat"),
    reducedMotionDurationMs: 180,
    startPreset: "home",
    endPreset: "home",
    worldAction: "orb opens into a calm companion chamber without leaving the sanctuary",
    routeCommitAtMs: 540,
    inputUnlockAtMs: lastPhase("homeToOchat"),
  },
  ochatToHome: {
    id: "ochatToHome",
    fromRoute: "/ochat",
    toRoute: "/home",
    durationMs: lastPhase("ochatToHome"),
    reducedMotionDurationMs: 160,
    startPreset: "home",
    endPreset: "home",
    worldAction: "companion chamber settles back into the grounded home orb",
    routeCommitAtMs: 280,
    inputUnlockAtMs: lastPhase("ochatToHome"),
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

function resolveUiOpacity(progress: number): number {
  if (progress < 0.18) return clamp01(1 - progress / 0.18);
  if (progress > 0.82) return clamp01((progress - 0.82) / 0.18);
  return 0;
}

export function getTransitionCameraFrame(
  transitionId: UraiCinematicTransitionId,
  elapsedMs: number,
  options: { reducedMotion?: boolean } = {},
): UraiCameraFrame {
  const transition = URAI_CINEMATIC_TRANSITIONS[transitionId];
  const duration = options.reducedMotion ? transition.reducedMotionDurationMs : transition.durationMs;
  const progress = easeOutCubic(elapsedMs / duration);
  const startPreset: UraiCameraPreset = URAI_CAMERA_PRESETS[transition.startPreset];
  const endPreset: UraiCameraPreset = URAI_CAMERA_PRESETS[transition.endPreset];
  const inputUnlockAtMs = options.reducedMotion ? duration : transition.inputUnlockAtMs;

  return {
    position: lerpVec3(startPreset.position, endPreset.position, progress),
    target: lerpVec3(startPreset.target, endPreset.target, progress),
    fov: lerp(startPreset.fov, endPreset.fov, progress),
    bloom: lerp(0.78, 1.14, progress),
    fog: lerp(0.34, 0.68, Math.sin(progress * Math.PI)),
    starOpacity: lerp(0.32, transitionId === "lifeMapToHome" || transitionId === "ochatToHome" ? 0.28 : 1, progress),
    uiOpacity: resolveUiOpacity(progress),
    inputLocked: elapsedMs < inputUnlockAtMs,
  };
}

export function resolveUraiCameraFrame(
  transitionId: UraiCinematicTransitionId,
  elapsedMs: number,
  reducedMotion = false,
): UraiCameraFrame {
  return getTransitionCameraFrame(transitionId, elapsedMs, { reducedMotion });
}

export function shouldCommitRoute(transitionId: UraiCinematicTransitionId, elapsedMs: number): boolean {
  return elapsedMs >= URAI_CINEMATIC_TRANSITIONS[transitionId].routeCommitAtMs;
}

export function getRouteTransitionForRoutes(from: UraiRouteId, to: UraiRouteId): UraiCinematicTransitionContract | null {
  return Object.values(URAI_CINEMATIC_TRANSITIONS).find((transition) => transition.fromRoute === from && transition.toRoute === to) ?? null;
}

export function assertUraiCinematicTransitionIntegrity(): string[] {
  const failures: string[] = [];
  for (const [id, transition] of Object.entries(URAI_CINEMATIC_TRANSITIONS) as [UraiCinematicTransitionId, UraiCinematicTransitionContract][]) {
    if (transition.id !== id) failures.push(`Cinematic transition id mismatch: ${id}`);
    if (transition.durationMs <= 0) failures.push(`Cinematic transition must have positive duration: ${id}`);
    if (transition.reducedMotionDurationMs <= 0) failures.push(`Cinematic transition must have reduced-motion duration: ${id}`);
    if (transition.reducedMotionDurationMs > transition.durationMs) failures.push(`Reduced-motion duration must not exceed full duration: ${id}`);
    if (transition.routeCommitAtMs <= 0 || transition.routeCommitAtMs > transition.durationMs) failures.push(`Route commit timing out of range: ${id}`);
    if (transition.inputUnlockAtMs < transition.routeCommitAtMs) failures.push(`Input must not unlock before route commit: ${id}`);
    if (!URAI_CAMERA_PRESETS[transition.startPreset]) failures.push(`Missing start camera preset: ${id}`);
    if (!URAI_CAMERA_PRESETS[transition.endPreset]) failures.push(`Missing end camera preset: ${id}`);
  }
  return failures;
}
