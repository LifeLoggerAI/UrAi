import { CompanionQuickPrompt } from "./companionTypes";

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
    action: "openPassport",
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

const COUNCIL_QUICK_PROMPTS: CompanionQuickPrompt[] = [
  {
    id: "council-reflect",
    label: "Reflect with Council",
    prompt: "What is the gentlest pattern I should notice right now?",
    mode: "council",
  },
  {
    id: "council-ground",
    label: "Ground me",
    prompt: "Give me a small grounding ritual.",
    mode: "council",
    action: "suggestRitual",
  },
];

export function getCompanionQuickPrompts(): CompanionQuickPrompt[] {
  return COMPANION_QUICK_PROMPTS;
}

export function getQuickPromptsForContext(mode: string = "companion", councilRoleId?: string): CompanionQuickPrompt[] {
  if (mode === "council") {
    return COUNCIL_QUICK_PROMPTS.map((prompt) => ({
      ...prompt,
      councilRoleId,
    }));
  }

  return COMPANION_QUICK_PROMPTS;
}
