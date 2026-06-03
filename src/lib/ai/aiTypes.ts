import type { CompanionMessage, CompanionMode, GenesisMoodState } from "@/lib/companion/companionTypes";

export type UraiAIProvider = "openai" | "local_fallback" | "disabled";

export type UraiAIResponseMode =
  | "companion"
  | "guide"
  | "mirror"
  | "guardian"
  | "archivist"
  | "builder"
  | "trickster";

export type UraiAISafetyLevel = "normal" | "gentle" | "boundary" | "crisis_boundary";

export type UraiAISuggestedActionType =
  | "open_life_map"
  | "open_ground"
  | "open_mirror"
  | "open_shadow"
  | "open_legacy"
  | "open_passport"
  | "open_settings"
  | "start_ritual"
  | "open_export_center"
  | "none";

export type UraiAISuggestedAction = {
  type: UraiAISuggestedActionType;
  label?: string;
};

export type PassportDataLayerId =
  | "mood"
  | "life_map"
  | "ground"
  | "mirror"
  | "shadow"
  | "legacy"
  | "rituals"
  | "notifications"
  | "exports"
  | "account"
  | "gmail"
  | "location"
  | "transcripts"
  | "relationships"
  | "health"
  | "device_behavior"
  | "calendar"
  | "companion_memory";

export type PermissionedCompanionContext = {
  allowedLayers: PassportDataLayerId[];
  blockedLayers: PassportDataLayerId[];
  moodContext?: string | null;
  lifeMapContext?: string | null;
  groundContext?: string | null;
  mirrorContext?: string | null;
  shadowContext?: string | null;
  legacyContext?: string | null;
  ritualContext?: string | null;
  notificationContext?: string | null;
  exportContext?: string | null;
  accountContext?: string | null;
  availableActions: UraiAISuggestedActionType[];
};

export type UraiAIRequest = {
  message: string;
  mode: CompanionMode;
  councilRoleId?: string;
  moodState?: GenesisMoodState;
  userId?: string;
  context: PermissionedCompanionContext;
  conversationSummary?: string;
  recentMessages?: CompanionMessage[];
};

export type UraiAIReply = {
  text: string;
  caption?: string;
  councilRoleId?: string;
  safetyLevel: UraiAISafetyLevel;
  suggestedAction?: UraiAISuggestedAction;
  shouldStoreSummary?: boolean;
  sessionSummaryDelta?: string;
  provider?: UraiAIProvider;
};
