import { CompanionQuickPrompt } from "./companionTypes";

export const COMPANION_QUICK_PROMPTS: CompanionQuickPrompt[] = [
  {
    id: "what-am-i-looking-at",
    label: "What am I looking at?",
    prompt: "What am I looking at?",
    mode: "companion",
  },
  {
    id: "help-me-calm-this-down",
    label: "Help me calm this down",
    prompt: "Help me calm this down",
    mode: "companion",
  },
  {
    id: "show-me-the-life-map",
    label: "Show me the Life Map",
    prompt: "Show me the Life Map",
    mode: "companion",
  },
];

export const COUNCIL_GUIDE_QUICK_PROMPTS: CompanionQuickPrompt[] = [
  {
    id: "orient-me",
    label: "Orient me",
    prompt: "Orient me",
    mode: "council",
    councilRoleId: "guide",
  },
  {
    id: "what-should-i-look-at-first",
    label: "What should I look at first?",
    prompt: "What should I look at first?",
    mode: "council",
    councilRoleId: "guide",
  },
];

export const COUNCIL_MIRROR_QUICK_PROMPTS: CompanionQuickPrompt[] = [
  {
    id: "reflect-the-pattern",
    label: "Reflect the pattern",
    prompt: "Reflect the pattern",
    mode: "council",
    councilRoleId: "mirror",
  },
  {
    id: "what-keeps-repeating",
    label: "What keeps repeating?",
    prompt: "What keeps repeating?",
    mode: "council",
    councilRoleId: "mirror",
  },
];

export const COUNCIL_GUARDIAN_QUICK_PROMPTS: CompanionQuickPrompt[] = [
  {
    id: "what-can-i-control",
    label: "What can I control?",
    prompt: "What can I control?",
    mode: "council",
    councilRoleId: "guardian",
  },
  {
    id: "open-passport-settings",
    label: "Open Passport settings",
    prompt: "Open Passport settings",
    mode: "council",
    councilRoleId: "guardian",
  },
];
