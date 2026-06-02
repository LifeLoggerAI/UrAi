import type { PassportContextPermissions } from "@/lib/passport/passportContextTypes";

export type CompanionSafetyLevel = "normal" | "gentle" | "boundary";

export type CompanionSuggestedAction = {
  type: "open_life_map" | "open_passport" | "open_ground" | "none";
  label?: string;
};

export type CompanionSafetyResult = {
  safetyLevel: CompanionSafetyLevel;
  boundaryReply?: string;
  suggestedAction?: CompanionSuggestedAction;
};

const crisisTerms = ["kill myself", "end my life", "suicide", "hurt myself", "not safe"];
const clinicalTerms = ["diagnose", "disorder", "medical", "therapy", "therapist", "medication"];
const privateContextTerms = ["calls", "transcript", "email", "gmail", "calendar", "location", "where was i", "what did they say"];
const certaintyTerms = ["lying", "lie", "deceive", "deception", "intent", "prove"];

function includesAny(input: string, terms: string[]): boolean {
  const value = input.toLowerCase();
  return terms.some((term) => value.includes(term));
}

export function evaluateCompanionSafety(message: string, permissions: PassportContextPermissions): CompanionSafetyResult {
  const value = message.toLowerCase();

  if (includesAny(value, crisisTerms)) {
    return {
      safetyLevel: "gentle",
      boundaryReply: "I’m here with you. If you might be in immediate danger, contact local emergency help or someone you trust right now.",
      suggestedAction: { type: "none" },
    };
  }

  if (includesAny(value, clinicalTerms)) {
    return {
      safetyLevel: "boundary",
      boundaryReply: "I can reflect and help you slow this down, but I can’t diagnose or replace care.",
      suggestedAction: { type: "none" },
    };
  }

  const asksForTranscriptLayer = value.includes("call") || value.includes("transcript") || value.includes("what did they say");
  const asksForMailLayer = value.includes("email") || value.includes("gmail");
  const asksForCalendarLayer = value.includes("calendar");
  const asksForLocationLayer = value.includes("location") || value.includes("where was i");

  if (
    (asksForTranscriptLayer && !permissions.allowAudioTranscriptContext) ||
    (asksForMailLayer && !permissions.allowGmailContext) ||
    (asksForCalendarLayer && !permissions.allowCalendarContext) ||
    (asksForLocationLayer && !permissions.allowLocationContext) ||
    (includesAny(value, privateContextTerms) && !permissions.allowAudioTranscriptContext && !permissions.allowGmailContext && !permissions.allowCalendarContext && !permissions.allowLocationContext)
  ) {
    return {
      safetyLevel: "boundary",
      boundaryReply: "I can help with that only if you allow that layer in Passport. You stay in control.",
      suggestedAction: { type: "open_passport", label: "Open Passport" },
    };
  }

  if (includesAny(value, certaintyTerms)) {
    return {
      safetyLevel: "boundary",
      boundaryReply: "I can help you look at patterns carefully, but I won’t claim certainty about someone’s intent.",
      suggestedAction: { type: "none" },
    };
  }

  return { safetyLevel: "normal", suggestedAction: { type: "none" } };
}
