const SAFE_DEEP_ROUTE_ID = /^[a-z0-9][a-z0-9-]{1,90}$/i;

export const PUBLIC_DEMO_MEMORY_IDS = new Set([
  "memory-001",
  "memory-sample",
  "sample",
  "bloom-001",
  "bloom-002",
  "bloom-003",
]);

export const PUBLIC_DEMO_STAR_IDS = new Set([
  "star-001",
  "star-002",
  "star-003",
  "star-004",
  "star-005",
  "star-006",
  "star-007",
  "star-008",
  "star-009",
  "star-010",
  "star-011",
  "star-012",
  "star-threshold-before-clarity",
  "star-new-center",
  "star-dream-symbol",
]);

export const PUBLIC_DEMO_REPLAY_IDS = new Set([
  "sample-replay",
  "replay-sample",
  "memory-001",
  "genesis-preview",
]);

export const PUBLIC_DEMO_FOCUS_SESSION_IDS = new Set([
  "sample-session",
  "session-sample",
  "genesis-focus",
]);

export function isSafeDeepRouteId(value: string | undefined): value is string {
  return typeof value === "string" && SAFE_DEEP_ROUTE_ID.test(value);
}

export function isPublicDemoMemoryId(value: string | undefined): value is string {
  return isSafeDeepRouteId(value) && PUBLIC_DEMO_MEMORY_IDS.has(value);
}

export function isPublicDemoStarId(value: string | undefined): value is string {
  return isSafeDeepRouteId(value) && PUBLIC_DEMO_STAR_IDS.has(value);
}

export function isPublicDemoReplayId(value: string | undefined): value is string {
  return isSafeDeepRouteId(value) && PUBLIC_DEMO_REPLAY_IDS.has(value);
}

export function isPublicDemoFocusSessionId(value: string | undefined): value is string {
  return isSafeDeepRouteId(value) && PUBLIC_DEMO_FOCUS_SESSION_IDS.has(value);
}

export function publicProfileHandle(value: string | undefined): string | null {
  if (!value || !/^[a-z0-9][a-z0-9_.-]{1,40}$/i.test(value)) return null;
  return value.toLowerCase();
}
