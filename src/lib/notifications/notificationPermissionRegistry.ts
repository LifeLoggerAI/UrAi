import type { NotificationPermissionDefinition, NotificationPermissionState, UraiNotificationType } from "./notificationTypes";

export const NOTIFICATION_PERMISSION_DEFINITIONS: NotificationPermissionDefinition[] = [
  { type: "companion_whisper", label: "Companion whispers", description: "Rare in-app notes from URAI.", defaultEnabled: false, allowedChannels: ["in_app"], defaultChannels: ["in_app"], sensitivity: "medium" },
  { type: "grounding_prompt", label: "Grounding prompts", description: "Small reminders that Ground is available.", defaultEnabled: false, allowedChannels: ["in_app", "push"], defaultChannels: ["in_app"], sensitivity: "medium" },
  { type: "ritual_reminder", label: "Ritual reminders", description: "Gentle reminders for rituals you saved.", defaultEnabled: false, allowedChannels: ["in_app", "push"], defaultChannels: ["in_app"], sensitivity: "medium" },
  { type: "passport_review", label: "Passport reminders", description: "Notices when a setting may need review.", defaultEnabled: false, allowedChannels: ["in_app"], defaultChannels: ["in_app"], sensitivity: "low" },
  { type: "life_map_update", label: "Life Map updates", description: "Permissioned stars ready for review.", defaultEnabled: false, allowedChannels: ["in_app", "push"], defaultChannels: ["in_app"], sensitivity: "medium" },
  { type: "mirror_reflection", label: "Mirror reflections", description: "Gentle pattern reflections without details.", defaultEnabled: false, allowedChannels: ["in_app"], defaultChannels: ["in_app"], sensitivity: "high" },
  { type: "shadow_boundary", label: "Shadow boundary notices", description: "Generic protected Shadow notices only.", defaultEnabled: false, allowedChannels: ["in_app"], defaultChannels: ["in_app"], sensitivity: "very_high" },
  { type: "legacy_prompt", label: "Legacy prompts", description: "Optional carry-forward prompts.", defaultEnabled: false, allowedChannels: ["in_app"], defaultChannels: ["in_app"], sensitivity: "high" },
  { type: "export_ready", label: "Export notices", description: "Export artifacts ready for review.", defaultEnabled: false, allowedChannels: ["in_app"], defaultChannels: ["in_app"], sensitivity: "medium" },
  { type: "recovery_bloom", label: "Recovery blooms", description: "Soft in-app bloom notices.", defaultEnabled: false, allowedChannels: ["in_app"], defaultChannels: ["in_app"], sensitivity: "high" },
  { type: "system", label: "System notices", description: "Safe app-state notices.", defaultEnabled: true, allowedChannels: ["in_app"], defaultChannels: ["in_app"], sensitivity: "low" },
];

export function createDefaultNotificationPermissions(): Record<UraiNotificationType, NotificationPermissionState> {
  return Object.fromEntries(NOTIFICATION_PERMISSION_DEFINITIONS.map((definition) => [definition.type, { ...definition, enabled: definition.defaultEnabled, channels: definition.defaultChannels }])) as Record<UraiNotificationType, NotificationPermissionState>;
}

export function getNotificationPermissionDefinition(type: UraiNotificationType): NotificationPermissionDefinition {
  return NOTIFICATION_PERMISSION_DEFINITIONS.find((definition) => definition.type === type) ?? NOTIFICATION_PERMISSION_DEFINITIONS[NOTIFICATION_PERMISSION_DEFINITIONS.length - 1];
}
