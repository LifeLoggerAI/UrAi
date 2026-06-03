import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";

export type UraiNotificationType =
  | "companion_whisper"
  | "grounding_prompt"
  | "ritual_reminder"
  | "passport_review"
  | "life_map_update"
  | "mirror_reflection"
  | "shadow_boundary"
  | "legacy_prompt"
  | "export_ready"
  | "recovery_bloom"
  | "system";

export type UraiNotificationPriority = "silent" | "low" | "normal" | "important";
export type UraiNotificationChannel = "in_app" | "push" | "sms" | "email";
export type UraiNotificationStatus = "draft" | "scheduled" | "shown" | "dismissed" | "snoozed" | "blocked";

export type UraiNotification = {
  id: string;
  type: UraiNotificationType;
  title: string;
  body: string;
  priority: UraiNotificationPriority;
  channels: UraiNotificationChannel[];
  createdAt: string;
  scheduledFor?: string;
  shownAt?: string;
  status: UraiNotificationStatus;
  sourceType?: "ground" | "ritual" | "mirror" | "shadow" | "legacy" | "passport" | "companion" | "lifemap" | "system";
  sourceId?: string;
  sourceLayerIds: PassportDataLayerId[];
  action?: {
    label: string;
    type:
      | "open_companion"
      | "open_ground"
      | "open_ritual"
      | "open_passport"
      | "open_life_map"
      | "open_mirror"
      | "open_shadow"
      | "open_legacy"
      | "none";
  };
  expiresAt?: string;
};

export type NotificationTimingProfile = {
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  maxPerDay: number;
  maxPerWeek: number;
  allowPush: boolean;
  allowSms: boolean;
  allowEmail: boolean;
  allowInApp: boolean;
  reducedNotificationMode: boolean;
  lastShownAt?: string;
  timezone?: string;
};

export type NotificationPermissionDefinition = {
  type: UraiNotificationType;
  label: string;
  description: string;
  defaultEnabled: boolean;
  allowedChannels: UraiNotificationChannel[];
  defaultChannels: UraiNotificationChannel[];
  sensitivity: "low" | "medium" | "high" | "very_high";
};

export type NotificationPermissionState = NotificationPermissionDefinition & {
  enabled: boolean;
  channels: UraiNotificationChannel[];
};

export type NotificationSurfaceDecision = {
  allowed: boolean;
  reason?: string;
  adjustedChannel?: UraiNotificationChannel[];
  suggestedTime?: string;
};
