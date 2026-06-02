import { CompanionMessage, CompanionMode } from "./companionTypes";
import { GenesisMoodState } from "../types";

type LocalCompanionResponderInput = {
  text: string;
  source?: CompanionMessage["source"];
};

type LocalCompanionResponderContext = {
  mode: CompanionMode;
  councilRoleId?: string;
  moodState?: GenesisMoodState;
};

const localUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


export function generateLocalCompanionResponse(
  input: LocalCompanionResponderInput,
  context: LocalCompanionResponderContext
): CompanionMessage {
  const { text } = input;
  const { mode, councilRoleId } = context;

  let responseText = "I’m here. Say a little or a lot.";
  let responseCouncilRoleId = councilRoleId;

  const lowercasedText = text.toLowerCase();

  if (
    lowercasedText.includes("privacy") ||
    lowercasedText.includes("data") ||
    lowercasedText.includes("permission") ||
    lowercasedText.includes("control") ||
    lowercasedText.includes("passport") ||
    lowercasedText.includes("settings")
  ) {
    responseCouncilRoleId = "guardian";
  } else if (
    lowercasedText.includes("pattern") ||
    lowercasedText.includes("repeat") ||
    lowercasedText.includes("why") ||
    lowercasedText.includes("mirror") ||
    lowercasedText.includes("reflect")
  ) {
    responseCouncilRoleId = "mirror";
  } else if (
    lowercasedText.includes("map") ||
    lowercasedText.includes("what is this") ||
    lowercasedText.includes("where") ||
    lowercasedText.includes("explain") ||
    lowercasedText.includes("orient") ||
    lowercasedText.includes("start") ||
    lowercasedText.includes("first")
  ) {
    responseCouncilRoleId = "guide";
  }


  if (mode === "council" || responseCouncilRoleId) {
    switch (responseCouncilRoleId) {
      case "guide":
        responseText = "Let’s orient first. Are you trying to understand, decide, or calm things down?";
        if (lowercasedText.includes("start") || lowercasedText.includes("first")) {
          responseText = "Start with one thing. What feels most useful to see right now?";
        }
        break;
      case "mirror":
        responseText = "I can reflect the pattern, but I won’t judge it. What part should we look at?";
         if (lowercasedText.includes("repeating")) {
            responseText = "We can look at what keeps repeating, gently and clearly.";
        }
        break;
      case "guardian":
        responseText = "You stay in control here. We can pause, hide, or narrow what URAI uses.";
        if (lowercasedText.includes("control") || lowercasedText.includes("decide")) {
            responseText = "You decide what URAI can use. We can keep this narrow.";
        }
        break;
      default:
        responseText = "We can keep this simple. What do you want to look at first?";
        break;
    }
  } else {
      if (
        lowercasedText.includes("calm") ||
        lowercasedText.includes("overwhelm") ||
        lowercasedText.includes("anxious") ||
        lowercasedText.includes("stress")
      ) {
        responseText = "Let's take a moment. We can focus on just one thing to ground us.";
      } else if (lowercasedText.includes("step")) {
        responseText = "We can turn this into a small next step.";
      } else {
        responseText = "I’m here. Say a little or a lot.";
      }
  }


  return {
    id: localUUID(),
    role: "urai",
    mode: context.mode,
    councilRoleId: responseCouncilRoleId,
    text: responseText,
    createdAt: new Date().toISOString(),
    moodState: context.moodState,
    source: "systemWhisper",
  };
}
