import type { CompanionMessage, LocalCompanionResponderContext } from "./companionTypes";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `urai-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeInput(input: string): string {
  return input.trim().toLowerCase();
}

function chooseResponse(input: string, context: LocalCompanionResponderContext): string {
  const normalized = normalizeInput(input);

  if (context.mode === "council") {
    if (context.councilRoleId === "guardian") {
      if (normalized.includes("passport") || normalized.includes("settings") || normalized.includes("control")) {
        return "You decide what URAI can use. We can open the controls and narrow it.";
      }
      return "You stay in control here. We can pause, hide, or narrow what URAI uses.";
    }

    if (context.councilRoleId === "mirror") {
      if (normalized.includes("repeat") || normalized.includes("pattern")) {
        return "I can reflect the pattern without judging it. Name the part that keeps returning.";
      }
      return "I can reflect this gently. What part should we look at first?";
    }

    if (context.councilRoleId === "guide") {
      if (normalized.includes("looking") || normalized.includes("what is") || normalized.includes("orient")) {
        return "This is your Genesis scene. Start with sky, Ground, Passport, or the orb.";
      }
      return "Let’s orient first. Are you trying to understand, decide, or calm things down?";
    }
  }

  if (normalized.includes("calm") || normalized.includes("anxious") || normalized.includes("overwhelmed")) {
    return "We can keep this small. One breath, one choice, one next step.";
  }

  if (normalized.includes("life map") || normalized.includes("map")) {
    return "The Life Map opens through the sky. I can help you move there when you’re ready.";
  }

  if (normalized.includes("passport") || normalized.includes("privacy") || normalized.includes("settings")) {
    return "You decide what URAI can use. Passport is where those controls live.";
  }

  if (normalized.includes("what am i looking at") || normalized.includes("what is this")) {
    return "This is Genesis: sky for your Life Map, Ground for roots, Passport for control, and the orb for URAI.";
  }

  const companionResponses = [
    "I’m here. Say a little or a lot.",
    "We can keep this simple. What do you want to look at first?",
    "We can turn this into a small next step.",
    "Stay close to what feels useful. We do not need to rush.",
  ];

  return companionResponses[Math.floor(Math.random() * companionResponses.length)];
}

export function generateLocalCompanionResponse(input: string, context: LocalCompanionResponderContext): CompanionMessage {
  return {
    id: createId(),
    role: "urai",
    mode: context.mode,
    councilRoleId: context.mode === "council" ? context.councilRoleId : undefined,
    text: chooseResponse(input, context),
    createdAt: new Date().toISOString(),
    moodState: context.moodState,
    source: "systemWhisper",
  };
}
