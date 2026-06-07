export type CompanionMode = "companion" | "council";

export type GenesisMoodState =
  | "calm"
  | "heavy"
  | "focused"
  | "anxious"
  | "hopeful"
  | "recovering"
  | "shadow"
  | "threshold"
  | "luminous";

export type CompanionMessageRole = "user" | "companion" | "system" | "urai";

export type CompanionMessage = {
  id: string;
  role: CompanionMessageRole;
  text: string;
  createdAt: string;
  mode?: CompanionMode;
  source?: string;
  councilRoleId?: string;
  moodState?: GenesisMoodState;
};

export type CompanionQuickPrompt = {
  id: string;
  label: string;
  prompt: string;
  action?: string;
  mode?: CompanionMode;
  councilRoleId?: string;
};

export type CompanionResponse = {
  message: CompanionMessage;
  suggestedPrompts?: CompanionQuickPrompt[];
};
