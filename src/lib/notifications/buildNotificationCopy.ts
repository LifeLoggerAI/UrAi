import type { UraiNotification, UraiNotificationType } from "./notificationTypes";

const COPY: Record<UraiNotificationType, { title: string; body: string }> = {
  companion_whisper: { title: "A quiet note", body: "URAI has something gentle available." },
  grounding_prompt: { title: "A small grounding moment", body: "Ground is available if you want something softer." },
  ritual_reminder: { title: "Your ritual is still here", body: "No pressure. You can return when it feels useful." },
  passport_review: { title: "Review what opens", body: "Passport lets you change what URAI can use." },
  life_map_update: { title: "A new star is ready", body: "A permissioned moment can appear in your Life Map." },
  mirror_reflection: { title: "A pattern may be forming", body: "Mirror has a gentle reflection ready." },
  shadow_boundary: { title: "Shadow is protected", body: "A heavier reflection stays closed unless you open it." },
  legacy_prompt: { title: "Carry this forward?", body: "A moment can be added to Legacy if you choose." },
  export_ready: { title: "Your artifact is ready", body: "An approved export can be reviewed now." },
  recovery_bloom: { title: "A small bloom appeared", body: "Ground has something soft available." },
  system: { title: "URAI notice", body: "A safe system note is available." },
};

export function buildNotificationCopy(candidate: Pick<UraiNotification, "type" | "title" | "body">): { title: string; body: string } {
  const fallback = COPY[candidate.type] ?? COPY.system;
  const title = candidate.title?.trim() ? candidate.title.trim().slice(0, 64) : fallback.title;
  const body = candidate.body?.trim() ? candidate.body.trim().slice(0, 140) : fallback.body;
  return { title, body };
}

export function safeNotificationCopy(type: UraiNotificationType): { title: string; body: string } {
  return COPY[type] ?? COPY.system;
}
