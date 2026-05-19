import { type UraiRouteId } from "./system";

export type UraiRouteMachineState =
  | "home"
  | "life-map"
  | "star-selected"
  | "focus-setup"
  | "focus-session"
  | "replay-library"
  | "replay-detail"
  | "fallback-notice";

export type UraiRouteMachineEvent =
  | { type: "OPEN_HOME" }
  | { type: "OPEN_LIFE_MAP" }
  | { type: "SELECT_STAR"; starId: string }
  | { type: "OPEN_FOCUS"; starId?: string }
  | { type: "OPEN_FOCUS_SESSION"; sessionId: string }
  | { type: "OPEN_REPLAY"; replayId?: string }
  | { type: "OPEN_REPLAY_DETAIL"; replayId: string }
  | { type: "ESC" }
  | { type: "INVALID_ID"; parent: UraiRouteMachineState }
  | { type: "LOCKED_OR_PRIVATE"; parent: UraiRouteMachineState };

export type UraiRouteMachineSnapshot = {
  state: UraiRouteMachineState;
  route: UraiRouteId | "/";
  starId?: string;
  sessionId?: string;
  replayId?: string;
  notice?: string;
};

export const URAI_INITIAL_ROUTE_MACHINE: UraiRouteMachineSnapshot = {
  state: "home",
  route: "/home",
};

export function reduceUraiRouteMachine(
  snapshot: UraiRouteMachineSnapshot,
  event: UraiRouteMachineEvent,
): UraiRouteMachineSnapshot {
  switch (event.type) {
    case "OPEN_HOME":
      return { state: "home", route: "/home" };
    case "OPEN_LIFE_MAP":
      return { state: "life-map", route: "/life-map" };
    case "SELECT_STAR":
      return { state: "star-selected", route: "/life-map/star/[starId]", starId: event.starId };
    case "OPEN_FOCUS":
      return event.starId
        ? { state: "focus-setup", route: "/focus", starId: event.starId }
        : { state: "life-map", route: "/life-map", notice: "Choose a star before opening focus." };
    case "OPEN_FOCUS_SESSION":
      return { state: "focus-session", route: "/focus/session/[sessionId]", sessionId: event.sessionId };
    case "OPEN_REPLAY":
      return event.replayId
        ? { state: "replay-detail", route: "/replay/[replayId]", replayId: event.replayId }
        : { state: "replay-library", route: "/replay" };
    case "OPEN_REPLAY_DETAIL":
      return { state: "replay-detail", route: "/replay/[replayId]", replayId: event.replayId };
    case "ESC":
      if (snapshot.state === "replay-detail") return { state: "focus-session", route: "/focus/session/[sessionId]", sessionId: snapshot.sessionId ?? "restored" };
      if (snapshot.state === "replay-library") return { state: "focus-setup", route: "/focus", starId: snapshot.starId };
      if (snapshot.state === "focus-session" || snapshot.state === "focus-setup") return { state: "life-map", route: "/life-map" };
      if (snapshot.state === "star-selected") return { state: "life-map", route: "/life-map" };
      if (snapshot.state === "life-map") return { state: "home", route: "/home" };
      return snapshot;
    case "INVALID_ID":
      return { state: "fallback-notice", route: parentRouteForState(event.parent), notice: "This item is unavailable or no longer exists." };
    case "LOCKED_OR_PRIVATE":
      return { state: "fallback-notice", route: parentRouteForState(event.parent), notice: "This item is private, locked, or unavailable in this view." };
    default:
      return snapshot;
  }
}

function parentRouteForState(state: UraiRouteMachineState): UraiRouteId | "/" {
  if (state === "star-selected") return "/life-map";
  if (state === "focus-session" || state === "focus-setup") return "/life-map";
  if (state === "replay-detail" || state === "replay-library") return "/focus";
  return "/home";
}

export type UraiFocusSessionState = "idle" | "planning" | "ready" | "active" | "paused" | "recovery" | "completed" | "archived";

export type UraiFocusSessionEvent =
  | "CHOOSE_INTENT"
  | "CLARIFY_NEXT_ACTION"
  | "START"
  | "PAUSE"
  | "RESUME"
  | "DISTRACTION_DETECTED"
  | "RECOVER"
  | "COMPLETE"
  | "ARCHIVE";

const FOCUS_TRANSITIONS: Record<UraiFocusSessionState, Partial<Record<UraiFocusSessionEvent, UraiFocusSessionState>>> = {
  idle: { CHOOSE_INTENT: "planning" },
  planning: { CLARIFY_NEXT_ACTION: "ready" },
  ready: { START: "active" },
  active: { PAUSE: "paused", DISTRACTION_DETECTED: "recovery", COMPLETE: "completed" },
  paused: { RESUME: "active", COMPLETE: "completed" },
  recovery: { RECOVER: "active", PAUSE: "paused", COMPLETE: "completed" },
  completed: { ARCHIVE: "archived" },
  archived: {},
};

export function reduceUraiFocusSessionState(state: UraiFocusSessionState, event: UraiFocusSessionEvent): UraiFocusSessionState {
  return FOCUS_TRANSITIONS[state][event] ?? state;
}

export type UraiReplayState =
  | "library"
  | "source-selection"
  | "sensitive-preview"
  | "draft-review"
  | "playing"
  | "paused"
  | "correction"
  | "redaction"
  | "export-review"
  | "archived";

export type UraiReplayEvent =
  | "SELECT_REPLAY"
  | "CHOOSE_SOURCES"
  | "PREVIEW_SENSITIVE_CONTENT"
  | "APPROVE_DRAFT"
  | "PLAY"
  | "PAUSE"
  | "CORRECT"
  | "REDACT"
  | "EXPORT"
  | "RETURN_TO_PLAYBACK"
  | "ARCHIVE";

const REPLAY_TRANSITIONS: Record<UraiReplayState, Partial<Record<UraiReplayEvent, UraiReplayState>>> = {
  library: { SELECT_REPLAY: "source-selection" },
  "source-selection": { CHOOSE_SOURCES: "sensitive-preview" },
  "sensitive-preview": { PREVIEW_SENSITIVE_CONTENT: "draft-review" },
  "draft-review": { APPROVE_DRAFT: "playing" },
  playing: { PAUSE: "paused", CORRECT: "correction", REDACT: "redaction", EXPORT: "export-review", ARCHIVE: "archived" },
  paused: { PLAY: "playing", CORRECT: "correction", REDACT: "redaction", ARCHIVE: "archived" },
  correction: { RETURN_TO_PLAYBACK: "playing" },
  redaction: { RETURN_TO_PLAYBACK: "playing", EXPORT: "export-review" },
  "export-review": { RETURN_TO_PLAYBACK: "playing", ARCHIVE: "archived" },
  archived: {},
};

export function reduceUraiReplayState(state: UraiReplayState, event: UraiReplayEvent): UraiReplayState {
  return REPLAY_TRANSITIONS[state][event] ?? state;
}
