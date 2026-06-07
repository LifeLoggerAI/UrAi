export type CompanionMessageRole = "user" | "companion" | "urai" | "system";

export type CompanionMode = "companion" | "council";
export type GenesisMoodState =
  | "luminous"
  | "balanced"
  | "positive"
  | "negative"
  | "shadow"
  | "recovery"
  | "unknown"
  | string;

export type CompanionMessageSource =
  | "manual"
  | "quickPrompt"
  | "systemWhisper"
  | "localFallback"
  | "remote"
  | string;

export type CompanionMessage = {
  id: string;
  role: CompanionMessageRole;
  text: string;
  createdAt: string;
  mode?: CompanionMode;
  councilRoleId?: string;
  moodState?: GenesisMoodState;
  source?: CompanionMessageSource;
};

export type CompanionQuickPromptAction =
  | "openLifeMap"
  | "openPassport"
  | "openGround"
  | "openMirror"
  | "openShadow"
  | "openLegacy"
  | "openExport"
  | "openSettings"
  | "suggestRitual";

export type CompanionQuickPrompt = {
  id: string;
  label: string;
  prompt: string;
  mode?: CompanionMode;
  councilRoleId?: string;
  action?: CompanionQuickPromptAction;
};

export type CompanionResponse = {
  message: CompanionMessage;
  suggestedPrompts?: CompanionQuickPrompt[];
};
