import type { CompanionMode, CompanionQuickPrompt } from "./companionTypes";

export const COMPANION_QUICK_PROMPTS: CompanionQuickPrompt[] = [
  { id: "life-map", label: "Show me the Life Map", prompt: "Show me the Life Map", mode: "companion", action: "openLifeMap" },
  { id: "what-looking-at", label: "What am I looking at?", prompt: "What am I looking at?", mode: "companion" },
  { id: "calm-support", label: "Help me settle this", prompt: "Help me settle this", mode: "companion" },
  { id: "reflect-pattern", label: "Reflect the pattern", prompt: "Reflect the pattern", mode: "council", councilRoleId: "mirror" },
  { id: "control", label: "What can I control?", prompt: "What can I control?", mode: "council", councilRoleId: "guardian" },
  { id: "passport-settings", label: "Open Passport settings", prompt: "Open Passport settings", mode: "council", councilRoleId: "guardian", action: "openPassport" },
];

export function getQuickPromptsForContext(mode: CompanionMode, councilRoleId?: string): CompanionQuickPrompt[] {
  return COMPANION_QUICK_PROMPTS.filter((prompt) => {
    if (!prompt.mode) return true;
    if (prompt.mode !== mode) return false;
    if (mode === "council" && prompt.councilRoleId && prompt.councilRoleId !== councilRoleId) return false;
    return true;
  }).slice(0, 4);
}
