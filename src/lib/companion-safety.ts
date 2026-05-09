export const COMPANION_SAFETY_BOUNDARY =
  "URAI Companion is a reflective demo guide, not a therapist, doctor, lawyer, crisis service, or diagnostic system.";

export const CRISIS_SUPPORT_COPY =
  "If you might hurt yourself or someone else, contact local emergency services or a trusted person now. In the U.S. or Canada, call or text 988 for immediate crisis support.";

const DIAGNOSIS_OR_CLINICAL_PATTERNS = [
  /diagnos(e|is|ed|ing)/i,
  /do i have (adhd|autism|depression|bipolar|ptsd|ocd|anxiety)/i,
  /am i (depressed|bipolar|autistic|adhd|suicidal)/i,
  /what medication/i,
  /prescrib(e|ed|ing)/i,
  /medical advice/i,
  /legal advice/i
];

const CRISIS_PATTERNS = [
  /\bkill myself\b/i,
  /\bsuicide\b/i,
  /\bend my life\b/i,
  /\bself[- ]?harm\b/i,
  /\bhurt myself\b/i,
  /\bhurt someone\b/i,
  /\bcan't go on\b/i
];

export type CompanionSafetyResult =
  | { safe: true }
  | {
      safe: false;
      moodTag: "tender" | "threshold";
      reply: string;
      insights: string[];
    };

export function evaluateCompanionSafety(message: string): CompanionSafetyResult {
  if (CRISIS_PATTERNS.some((pattern) => pattern.test(message))) {
    return {
      safe: false,
      moodTag: "tender",
      reply: `${COMPANION_SAFETY_BOUNDARY} ${CRISIS_SUPPORT_COPY}`,
      insights: ["Crisis language detected.", "Pause the demo flow and seek immediate human support."]
    };
  }

  if (DIAGNOSIS_OR_CLINICAL_PATTERNS.some((pattern) => pattern.test(message))) {
    return {
      safe: false,
      moodTag: "threshold",
      reply:
        `${COMPANION_SAFETY_BOUNDARY} I can reflect patterns and help you prepare questions, but I cannot diagnose, prescribe, or replace a qualified professional.`,
      insights: ["Keep companion output reflective, not clinical.", "Use URAI as a pattern journal, not a diagnostic authority."]
    };
  }

  return { safe: true };
}
