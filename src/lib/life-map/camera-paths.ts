import type { CameraKeyframe, SpatialCameraPath } from "./types";

export const easing = {
  linear: (t: number) => t,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
};

export function resolveEasing(name: CameraKeyframe["easing"]): (t: number) => number {
  return easing[name] ?? easing.easeInOutCubic;
}

export const cameraPaths: Record<"opening" | "starFocus" | "replay" | "mirror" | "shadowRealm" | "dream" | "rebirth" | "lifetimeReplay", CameraKeyframe[]> = {
  opening: [
    { position: { x: 0, y: 1.4, z: 8.2 }, target: { x: 0, y: 0, z: 0 }, durationMs: 900, easing: "easeInOutCubic" },
  ],
  starFocus: [
    { position: { x: -1.8, y: 1.45, z: 4.7 }, target: { x: -3.2, y: 0.6, z: 0.2 }, durationMs: 950, easing: "easeOutQuart" },
  ],
  replay: [
    { position: { x: -4.2, y: 2.5, z: 7.2 }, target: { x: -3.2, y: 0.6, z: 0.2 }, durationMs: 1200, easing: "easeInOutCubic" },
    { position: { x: -0.6, y: 1.1, z: 5.2 }, target: { x: 0.3, y: 0.2, z: -0.2 }, durationMs: 1300, easing: "easeInOutCubic" },
    { position: { x: 3.9, y: 1.9, z: 5.9 }, target: { x: 2.4, y: 0.7, z: -0.5 }, durationMs: 1100, easing: "easeOutQuart" },
  ],
  mirror: [
    { position: { x: 4.8, y: 1.8, z: 3.8 }, target: { x: -0.4, y: 0.3, z: 0 }, durationMs: 1100, easing: "easeInOutCubic" },
    { position: { x: -4.8, y: 1.8, z: 3.8 }, target: { x: 0.4, y: 0.3, z: 0 }, durationMs: 1100, easing: "easeInOutCubic" },
  ],
  shadowRealm: [
    { position: { x: 0.5, y: -0.7, z: 6.8 }, target: { x: 0, y: -1.1, z: -0.7 }, durationMs: 1200, easing: "easeInOutCubic" },
  ],
  dream: [
    { position: { x: -2.8, y: 3.1, z: 6.1 }, target: { x: 0, y: 1.1, z: -0.5 }, durationMs: 1300, easing: "easeOutQuart" },
  ],
  rebirth: [
    { position: { x: 0, y: 2.2, z: 4.9 }, target: { x: 2.1, y: 0.7, z: -0.9 }, durationMs: 1000, easing: "easeOutQuart" },
  ],
  lifetimeReplay: [
    { position: { x: -6, y: 3.2, z: 9 }, target: { x: -3, y: 0, z: 0 }, durationMs: 1400, easing: "easeInOutCubic" },
    { position: { x: 0, y: 4, z: 9 }, target: { x: 0, y: 0, z: 0 }, durationMs: 1500, easing: "easeInOutCubic" },
    { position: { x: 6, y: 3.2, z: 9 }, target: { x: 3, y: 0, z: 0 }, durationMs: 1400, easing: "easeInOutCubic" },
  ],
};

export const defaultCameraPathRecords: SpatialCameraPath[] = Object.entries(cameraPaths).map(([id, keyframes]) => ({
  id,
  userId: "demo-user",
  mode: id === "dream" ? "dreamPlanetarium" : id === "shadowRealm" ? "shadowRealm" : id === "mirror" ? "mirrorOfBecoming" : "memoryGalaxy",
  name: id,
  keyframes,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));
