import type { UraiAISafetyLevel, UraiAISuggestedAction } from "./aiTypes";

export type CompanionInputSafety = {
  safetyLevel: UraiAISafetyLevel;
  flags: string[];
  boundaryReply?: string;
  suggestedAction?: UraiAISuggestedAction;
};

function hasAny(input: string, terms: string[]): boolean {
  return terms.some((term) => input.includes(term));
}

export function classifyCompanionInput(message: string): CompanionInputSafety {
  const text = message.toLowerCase();
  const flags: string[] = [];

  if (hasAny(text, ["kill myself", "hurt myself", "end my life", "suicide", "i want to die", "imminent danger"])) flags.push("crisis_like");
  if (hasAny(text, ["diagnose", "am i bipolar", "am i depressed", "medical diagnosis", "do i have ptsd", "do i have adhd"])) flags.push("medical_diagnosis");
  if (hasAny(text, ["stalk", "track them", "spy", "surveil", "where is she", "where is he"])) flags.push("surveillance_or_stalking");
  if (hasAny(text, ["lying", "lie detector", "deceiving", "cheating for sure", "prove they lied"])) flags.push("deception_certainty");
  if (hasAny(text, ["read my gmail", "gmail", "email inbox"])) flags.push("gmail_context");
  if (hasAny(text, ["where was i", "where i was", "location", "gps", "yesterday"])) flags.push("location_context");
  if (hasAny(text, ["transcript", "recording", "what did they say", "conversation"])) flags.push("transcript_context");
  if (hasAny(text, ["relationship patterns", "relationship layer", "about my ex", "about my partner"])) flags.push("relationship_context");
  if (hasAny(text, ["health data", "heart rate", "sleep data", "medical data"])) flags.push("health_context");
  if (hasAny(text, ["open shadow", "shadow", "sealed", "hidden layer"])) flags.push("shadow_context");
  if (hasAny(text, ["legacy", "long-term story", "life archive"])) flags.push("legacy_context");
  if (hasAny(text, ["export everything", "export all", "send everything", "download everything"])) flags.push("export_request");
  if (hasAny(text, ["bypass passport", "ignore passport", "without permission", "force open"])) flags.push("bypass_passport");

  if (flags.includes("crisis_like")) {
    return {
      safetyLevel: "crisis_boundary",
      flags,
      boundaryReply: "I’m here with you, but I can’t be emergency help. If you might hurt yourself or someone else, call local emergency services now or reach a trusted person nearby.",
      suggestedAction: { type: "none" },
    };
  }

  if (flags.includes("bypass_passport")) {
    return {
      safetyLevel: "boundary",
      flags,
      boundaryReply: "I can’t bypass Passport. You stay in control of what URAI can use.",
      suggestedAction: { type: "open_passport", label: "Open Passport" },
    };
  }

  if (flags.includes("medical_diagnosis")) {
    return {
      safetyLevel: "boundary",
      flags,
      boundaryReply: "I can’t diagnose you. I can help you reflect generally, keep notes, or suggest a gentle next step to discuss with a qualified professional.",
      suggestedAction: { type: "open_mirror", label: "Open Mirror" },
    };
  }

  if (flags.includes("surveillance_or_stalking")) {
    return {
      safetyLevel: "boundary",
      flags,
      boundaryReply: "I can’t help track or privately infer another person. URAI is for your own reflection and consented context.",
      suggestedAction: { type: "open_passport", label: "Open Passport" },
    };
  }

  if (flags.includes("deception_certainty")) {
    return {
      safetyLevel: "boundary",
      flags,
      boundaryReply: "I can’t say someone is lying from here. I can help you notice uncertainty, boundaries, and what you may want to ask directly.",
      suggestedAction: { type: "open_mirror", label: "Open Mirror" },
    };
  }

  if (flags.includes("export_request")) {
    return {
      safetyLevel: "gentle",
      flags,
      boundaryReply: "Nothing leaves URAI until you approve the artifact. Export review should happen in the Export Center.",
      suggestedAction: { type: "open_export_center", label: "Open Export Center" },
    };
  }

  return { safetyLevel: flags.length ? "gentle" : "normal", flags };
}
