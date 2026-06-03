export type GenesisMoodState = "calm" | "heavy" | "focused" | "anxious" | "hopeful" | "recovering" | "shadow" | "threshold" | "luminous";

export type CompanionMode = "companion" | "council";

export type CompanionMessage = {
  id: string;
  role: "user" | "urai" | "system";
  mode: CompanionMode;
  councilRoleId?: string;
  text: string;
  createdAt: string;
  moodState?: GenesisMoodState;
  source?: "manual" | "quickPrompt" | "systemWhisper";
};

export type CompanionQuickPrompt = {
  id: string;
  label: string;
  prompt: string;
  mode?: CompanionMode;
  councilRoleId?: string;
  action?: "openLifeMap" | "openPassport" | "openGround" | "openMirror" | "openShadow" | "openLegacy" | "openExport" | "suggestRitual";
};

export type LocalCompanionResponderContext = {
  mode: CompanionMode;
  councilRoleId?: string;
  moodState?: GenesisMoodState;
};
