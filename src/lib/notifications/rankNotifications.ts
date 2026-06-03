import type { UraiNotification } from "./notificationTypes";

const BASE_SCORE: Record<UraiNotification["type"], number> = {
  ritual_reminder: 90,
  export_ready: 85,
  passport_review: 76,
  grounding_prompt: 70,
  recovery_bloom: 66,
  life_map_update: 58,
  legacy_prompt: 54,
  mirror_reflection: 45,
  shadow_boundary: 42,
  companion_whisper: 20,
  system: 30,
};

function sensitivityPenalty(notification: UraiNotification): number {
  if (notification.type === "shadow_boundary" || notification.sourceType === "shadow") return 30;
  if (notification.type === "mirror_reflection" || notification.type === "legacy_prompt") return 12;
  return 0;
}

export function scoreNotification(notification: UraiNotification, dismissedTypes: UraiNotification["type"][] = []): number {
  const recency = Math.max(0, 20 - Math.floor((Date.now() - new Date(notification.createdAt).getTime()) / (60 * 60 * 1000)));
  const actionScore = notification.action && notification.action.type !== "none" ? 10 : 0;
  const dismissedPenalty = dismissedTypes.filter((type) => type === notification.type).length * 15;
  return (BASE_SCORE[notification.type] ?? 0) + recency + actionScore - sensitivityPenalty(notification) - dismissedPenalty;
}

export function rankNotifications(notifications: UraiNotification[], dismissedTypes: UraiNotification["type"][] = []): UraiNotification[] {
  return [...notifications]
    .filter((notification) => notification.status === "draft" || notification.status === "scheduled")
    .sort((a, b) => scoreNotification(b, dismissedTypes) - scoreNotification(a, dismissedTypes));
}
