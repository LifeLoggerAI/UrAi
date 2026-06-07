import { CompanionQuickPrompt, CompanionMode } from "./companionTypes";

export const COMPANION_QUICK_PROMPTS: CompanionQuickPrompt[] = [
  {
    id: "what-can-urai-do",
    label: "What can URAI do?",
    prompt: "What can URAI do?",
  },
  {
    id: "show-passport",
    label: "Show me Passport",
    prompt: "Show me Passport",
  },
  {
    id: "what-is-genesis",
    label: "What is Genesis?",
    prompt: "What is Genesis?",
  },
  {
    id: "how-privacy-works",
    label: "How does privacy work?",
    prompt: "How does privacy work?",
  },
];

export function getCompanionQuickPrompts(): CompanionQuickPrompt[] {
  return COMPANION_QUICK_PROMPTS;
}

export function getQuickPromptsForContext(
  mode?: CompanionMode,
  councilRoleId?: string
): CompanionQuickPrompt[] {
  // This is a placeholder implementation. The actual implementation should
  // filter prompts based on the mode and councilRoleId.
  return COMPANION_QUICK_PROMPTS;
}
