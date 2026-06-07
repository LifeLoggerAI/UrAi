import {
  CompanionMessage,
  CompanionResponse,
  CompanionMessageRole,
} from "./companionTypes";
import { getCompanionQuickPrompts } from "./quickPrompts";

export function createCompanionMessage(params: {
  role: CompanionMessageRole;
  text: string;
}): CompanionMessage {
  return {
    id: `${params.role}-${Date.now()}`,
    role: params.role,
    text: params.text,
    createdAt: new Date().toISOString(),
  };
}

const safeResponses: { [key: string]: string[] } = {
  passive: ["Passive sources stay closed until you choose to open them in Passport."],
  tracking: ["Passive sources stay closed until you choose to open them in Passport."],
  collection: ["Passive sources stay closed until you choose to open them in Passport."],
  microphone: ["Sound playback is not recording. Audio capture would require an explicit permission step later."],
  mic: ["Sound playback is not recording. Audio capture would require an explicit permission step later."],
  recording: ["Sound playback is not recording. Audio capture would require an explicit permission step later."],
  audio: ["Sound playback is not recording. Audio capture would require an explicit permission step later."],
  listening: ["Sound playback is not recording. Audio capture would require an explicit permission step later."],
  diagnosis: ["URAI offers symbolic reflections, not diagnosis, therapy, or emergency support."],
  therapy: ["URAI offers symbolic reflections, not diagnosis, therapy, or emergency support."],
  crisis: ["URAI offers symbolic reflections, not diagnosis, therapy, or emergency support."],
  emergency: ["URAI offers symbolic reflections, not diagnosis, therapy, or emergency support."],
  depression: ["URAI offers symbolic reflections, not diagnosis, therapy, or emergency support."],
  anxiety: ["URAI offers symbolic reflections, not diagnosis, therapy, or emergency support."],
  shadow: ["Shadow and Legacy stay protected. They only open with your approval."],
  legacy: ["Shadow and Legacy stay protected. They only open with your approval."],
  ar: ["Spatial previews are optional and do not use camera or motion access unless you explicitly open them."],
  vr: ["Spatial previews are optional and do not use camera or motion access unless you explicitly open them."],
  spatial: ["Spatial previews are optional and do not use camera or motion access unless you explicitly open them."],
  camera: ["Spatial previews are optional and do not use camera or motion access unless you explicitly open them."],
  motion: ["Spatial previews are optional and do not use camera or motion access unless you explicitly open them."],
  passport: ["Passport controls what URAI can use. Closed layers stay closed."],
  privacy: ["Passport controls what URAI can use. Closed layers stay closed."],
  genesis: ["Genesis is URAI’s calm home layer: the orb, the atmosphere, and the quiet entry point into your private systems."],
  default: ["A reflection may fit this moment. URAI stays quiet until you choose what to open."],
};

export function getLocalCompanionResponse(input: string): CompanionResponse {
  const normalizedInput = input.toLowerCase().trim();
  let responseText = safeResponses["default"][0];

  for (const keyword in safeResponses) {
    if (normalizedInput.includes(keyword)) {
      responseText = safeResponses[keyword][0];
      break;
    }
  }

  const responseMessage = createCompanionMessage({
    role: 'companion',
    text: responseText,
  });

  return {
    message: responseMessage,
    suggestedPrompts: getCompanionQuickPrompts(),
  };
}

export function generateLocalCompanionResponse(
  input: string,
  context?: any
): CompanionMessage {
  return getLocalCompanionResponse(input).message;
}
