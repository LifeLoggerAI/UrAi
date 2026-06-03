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

  if (normalized.includes("gmail") || normalized.includes("email")) {
    return "I can help with email context only if Gmail is open in Passport.";
  }

  if (normalized.includes("where was i") || normalized.includes("location") || normalized.includes("gps")) {
    return "I can only use place context if Location is open in Passport.";
  }

  if (normalized.includes("transcript") || normalized.includes("recording") || normalized.includes("what did they say")) {
    return "I can reflect conversations only if Transcripts are open in Passport.";
  }

  if (normalized.includes("lying") || normalized.includes("lie") || normalized.includes("deceive")) {
    return "I can’t know whether someone is lying. I can help you slow down, name uncertainty, and choose a boundary.";
  }

  if (normalized.includes("diagnose") || normalized.includes("do i have")) {
    return "I can’t diagnose you. I can help you organize what you’re noticing for a qualified professional.";
  }

  if (normalized.includes("shadow")) {
    return "That belongs behind Shadow. You can open it only if you choose.";
  }

  if (normalized.includes("legacy")) {
    return "Legacy is closed unless you open it, so I won’t treat this as part of your long-term story.";
  }

  if (normalized.includes("export")) {
    return "Nothing leaves URAI until you approve the artifact.";
  }

  if (normalized.includes("notification") || normalized.includes("notify") || normalized.includes("whisper") || normalized.includes("quiet") || normalized.includes("quieter")) {
    if (normalized.includes("turn off") || normalized.includes("stop") || normalized.includes("quieter") || normalized.includes("quiet")) {
      return "URAI can stay quiet. Passport and Settings let you keep only the whispers you approve.";
    }
    if (normalized.includes("what did") || normalized.includes("about")) {
      return "Whispers are kept generic. Passport shows what URAI was allowed to surface.";
    }
    return "URAI should whisper only when it matters. You control notification timing in Settings.";
  }

  if (normalized.includes("ritual")) {
    return "Try one small ritual: breathe once, name the feeling softly, then choose one tiny next step.";
  }

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
      return "I can reflect this gently, without pretending certainty. What part should we look at first?";
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
