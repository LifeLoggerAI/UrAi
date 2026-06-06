export type CompanionMessageRole = "user" | "companion" | "system";

export type CompanionMessage = {
  id: string;
  role: CompanionMessageRole;
  text: string;
  createdAt: string;
};

export type CompanionQuickPrompt = {
  id: string;
  label: string;
  prompt: string;
};

export type CompanionResponse = {
  message: CompanionMessage;
  suggestedPrompts?: CompanionQuickPrompt[];
};
