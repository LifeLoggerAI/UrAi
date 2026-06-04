import { ConsentLayerId } from "@/lib/privacy/consentCopyRegistry";

export type OnboardingStepId =
  | "welcome"
  | "orb_intro"
  | "passport_intro"
  | "safe_defaults"
  | "device_activity_intro"
  | "sound_voice"
  | "notifications"
  | "life_map_preview"
  | "ground_preview"
  | "companion_intro"
  | "complete";

export type OnboardingStatus = "not_started" | "in_progress" | "skipped" | "completed";

export type OnboardingPreferences = {
  status: OnboardingStatus;
  completedStepIds: OnboardingStepId[];
  currentStepId: OnboardingStepId;
  hasSeenWelcome: boolean;
  safeDefaultsApplied: boolean;
  soundOffered: boolean;
  notificationsOffered: boolean;
  completedAt?: string;
  skippedAt?: string;
};

export type OnboardingChoice = {
  id: string;
  label: string;
  description?: string;
  action:
    | "continue"
    | "skip"
    | "open_passport"
    | "apply_safe_defaults"
    | "enable_sound"
    | "keep_sound_off"
    | "enable_notifications"
    | "keep_notifications_off"
    | "open_life_map_preview"
    | "open_ground_preview"
    | "open_companion";
};

export type OnboardingStep = {
  id: OnboardingStepId;
  title: string;
  body: string;
  choices: OnboardingChoice[];
  caption?: string;
  consentLayerId?: ConsentLayerId;
};

export const ONBOARDING_STEP_ORDER: OnboardingStepId[] = [
  "welcome",
  "orb_intro",
  "passport_intro",
  "safe_defaults",
  "device_activity_intro",
  "sound_voice",
  "notifications",
  "life_map_preview",
  "ground_preview",
  "companion_intro",
  "complete",
];

export const DEFAULT_ONBOARDING_PREFERENCES: OnboardingPreferences = {
  status: "not_started",
  completedStepIds: [],
  currentStepId: "welcome",
  hasSeenWelcome: false,
  safeDefaultsApplied: false,
  soundOffered: false,
  notificationsOffered: false,
};

export const ONBOARDING_STEPS: Record<OnboardingStepId, OnboardingStep> = {
  welcome: {
    id: "welcome",
    title: "Welcome to URAI.",
    body: "A quiet place for your life to become visible — only through the layers you choose to open.",
    choices: [
      { id: "enter", label: "Enter gently", action: "continue" },
      { id: "skip", label: "Skip", action: "skip" },
    ],
  },
  orb_intro: {
    id: "orb_intro",
    title: "The orb is your companion.",
    body: "Tap it when you want to ask, reflect, or understand what you’re seeing.",
    caption: "I’m here.",
    choices: [
      { id: "meet", label: "Meet the orb", action: "open_companion" },
      { id: "continue", label: "Continue", action: "continue" },
    ],
  },
  passport_intro: {
    id: "passport_intro",
    title: "Passport controls the gates.",
    body: "You choose what URAI can see, remember, reflect, use in AI replies, or export.",
    choices: [
      { id: "review", label: "Review Passport", action: "open_passport" },
      { id: "safe", label: "Use safe defaults", action: "continue" },
    ],
    consentLayerId: "passport",
  },
  safe_defaults: {
    id: "safe_defaults",
    title: "Start private.",
    body: "Safe defaults keep sensitive layers closed. You can open more later.",
    choices: [
      { id: "apply", label: "Apply safe defaults", action: "apply_safe_defaults" },
      { id: "closed", label: "Keep everything closed", action: "continue" },
    ],
  },
  device_activity_intro: {
    id: "device_activity_intro",
    title: "Device activity",
    body: "URAI can learn from your device activity to provide a more personalized experience.",
    choices: [],
    consentLayerId: "deviceBehavior",
  },
  sound_voice: {
    id: "sound_voice",
    title: "Sound is optional.",
    body: "URAI can stay silent, or you can enable soft ambient sound and voice captions.",
    choices: [
      { id: "off", label: "Keep sound off", action: "keep_sound_off" },
      { id: "enable", label: "Enable sound", action: "enable_sound" },
    ],
  },
  notifications: {
    id: "notifications",
    title: "Whispers are optional.",
    body: "URAI should only surface something when it matters. You can keep all notifications off.",
    choices: [
      { id: "off", label: "Keep notifications off", action: "keep_notifications_off" },
      { id: "inapp", label: "Use in-app whispers only", action: "enable_notifications" },
    ],
  },
  life_map_preview: {
    id: "life_map_preview",
    title: "The sky opens into your Life Map.",
    body: "Only approved moments and safe system stars appear until you open more layers.",
    choices: [
      { id: "preview", label: "Preview Life Map", action: "open_life_map_preview" },
      { id: "continue", label: "Continue", action: "continue" },
    ],
  },
  ground_preview: {
    id: "ground_preview",
    title: "The Ground holds what helps you return.",
    body: "Roots, blooms, and rituals can appear here — only from layers you allow.",
    choices: [
      { id: "preview", label: "Preview Ground", action: "open_ground_preview" },
      { id: "continue", label: "Continue", action: "continue" },
    ],
  },
  companion_intro: {
    id: "companion_intro",
    title: "You can ask URAI anything about what you see.",
    body: "If a layer is closed, URAI will tell you instead of pretending to know.",
    choices: [
      { id: "open", label: "Open Companion", action: "open_companion" },
      { id: "finish", label: "Finish", action: "continue" },
    ],
  },
  complete: {
    id: "complete",
    title: "Genesis is ready.",
    body: "Tap the sky, the orb, the Ground, or Passport whenever you want.",
    choices: [{ id: "enter", label: "Enter URAI", action: "continue" }],
  },
};
