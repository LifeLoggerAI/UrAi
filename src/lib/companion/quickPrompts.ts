import type { CompanionMode, CompanionQuickPrompt } from "./companionTypes";

export const COMPANION_QUICK_PROMPTS: CompanionQuickPrompt[] = [
  { id: "life-map", label: "Show me the Life Map", prompt: "Show me the Life Map", mode: "companion", action: "openLifeMap" },
  { id: "open-ground", label: "Open Ground", prompt: "Open Ground", mode: "companion", action: "openGround" },
  { id: "open-mirror", label: "Open Mirror", prompt: "Open Mirror", mode: "companion", action: "openMirror" },
  { id: "open-legacy", label: "Open Legacy", prompt: "Open Legacy", mode: "companion", action: "openLegacy" },
  { id: "what-looking-at", label: "What am I looking at?", prompt: "What am I looking at?", mode: "companion" },
  { id: "help-ground", label: "Help me ground", prompt: "Help me ground", mode: "companion" },
  { id: "show-chapters", label: "Show my chapters", prompt: "Show my chapters", mode: "companion", action: "openLegacy" },
  { id: "what-changed", label: "What changed?", prompt: "What changed?", mode: "council", councilRoleId: "mirror" },
  { id: "why-seeing-this", label: "Why am I seeing this?", prompt: "Why am I seeing this?", mode: "council", councilRoleId: "guardian" },
  { id: "open-shadow", label: "Open Shadow", prompt: "Open Shadow", mode: "council", councilRoleId: "guardian", action: "openShadow" },
  { id: "carry-forward", label: "Carry this forward", prompt: "Carry this forward", mode: "council", councilRoleId: "guardian", action: "openLegacy" },
  { id: "what-growing", label: "What is growing?", prompt: "What is growing?", mode: "council", councilRoleId: "mirror" },
  { id: "small-ritual", label: "Create a small ritual", prompt: "Create a small ritual", mode: "council", councilRoleId: "guide" },
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
  }).slice(0, 5);
}
