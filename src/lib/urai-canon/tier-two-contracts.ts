import { validateCanonicalObject, type UraiPrivacyState } from "./system";

export type UraiTierTwoAnalyticsEventName =
  | "life_map_star_previewed"
  | "life_map_filter_changed"
  | "focus_intent_selected"
  | "focus_session_started"
  | "focus_session_completed"
  | "replay_opened"
  | "replay_chapter_selected"
  | "replay_correction_started";

export type UraiTierTwoAnalyticsEvent = {
  name: UraiTierTwoAnalyticsEventName;
  route: string;
  generatedAt: string;
  privacyState: UraiPrivacyState;
  metadata: Record<string, string | number | boolean | null>;
};

export type UraiTierTwoFocusMetadata = {
  sessionId: string;
  sourceStarId?: string;
  intent: "quick-focus" | "deep-work" | "creative-flow" | "recovery-focus" | "manual-focus";
  state: "planning" | "ready" | "active" | "paused" | "recovery" | "completed" | "archived";
  startedAt?: string;
  completedAt?: string;
  reflection?: string;
  privacyState: UraiPrivacyState;
};

export type UraiTierTwoReplayMetadata = {
  replayId: string;
  sourceRefs: string[];
  chapterIds: string[];
  resumeChapterId?: string;
  state: "library" | "source-selection" | "sensitive-preview" | "draft-review" | "playing" | "paused" | "correction" | "redaction" | "export-review" | "archived";
  privacyState: UraiPrivacyState;
  correctionAllowed: boolean;
  redactionAllowed: boolean;
};

const BLOCKED_ANALYTICS_KEYS = [
  "content",
  "body",
  "transcript",
  "rawText",
  "memoryText",
  "sourceRefs",
  "evidenceRefs",
  "privateNote",
  "vaultedContent",
] as const;

export function createTierTwoAnalyticsEvent(event: UraiTierTwoAnalyticsEvent): UraiTierTwoAnalyticsEvent {
  return {
    ...event,
    metadata: sanitizeTierTwoAnalyticsMetadata(event.metadata),
  };
}

export function sanitizeTierTwoAnalyticsMetadata(metadata: Record<string, string | number | boolean | null>): Record<string, string | number | boolean | null> {
  const sanitized: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (BLOCKED_ANALYTICS_KEYS.includes(key as (typeof BLOCKED_ANALYTICS_KEYS)[number])) continue;
    sanitized[key] = value;
  }
  return sanitized;
}

export function validateTierTwoAnalyticsEvent(event: UraiTierTwoAnalyticsEvent): string[] {
  const failures: string[] = [];
  if (["sensitive", "vaulted", "deleted"].includes(event.privacyState)) {
    failures.push("Tier 2 analytics cannot emit sensitive, vaulted, or deleted content events.");
  }
  for (const key of Object.keys(event.metadata)) {
    if (BLOCKED_ANALYTICS_KEYS.includes(key as (typeof BLOCKED_ANALYTICS_KEYS)[number])) {
      failures.push(`Tier 2 analytics metadata contains blocked key: ${key}`);
    }
  }
  return failures;
}

export function validateTierTwoFocusMetadata(metadata: UraiTierTwoFocusMetadata): string[] {
  const failures: string[] = [];
  if (!metadata.sessionId) failures.push("Focus metadata requires sessionId.");
  if (metadata.state === "completed" && !metadata.completedAt) failures.push("Completed focus sessions require completedAt.");
  if (["sensitive", "vaulted", "deleted"].includes(metadata.privacyState)) {
    failures.push("Tier 2 focus metadata cannot expose sensitive, vaulted, or deleted session state by default.");
  }
  return failures;
}

export function validateTierTwoReplayMetadata(metadata: UraiTierTwoReplayMetadata): string[] {
  const failures: string[] = [];
  if (!metadata.replayId) failures.push("Replay metadata requires replayId.");
  if (!metadata.sourceRefs.length) failures.push("Replay metadata requires at least one source reference.");
  if (metadata.state === "playing" && metadata.chapterIds.length === 0) failures.push("Playing replay requires at least one chapter.");
  if (["sensitive", "vaulted", "deleted"].includes(metadata.privacyState)) {
    failures.push("Tier 2 replay metadata cannot expose sensitive, vaulted, or deleted replay state by default.");
  }
  return failures;
}

export function tierTwoObjectIsCanonSafe(value: unknown): boolean {
  return validateCanonicalObject(value).ok;
}
