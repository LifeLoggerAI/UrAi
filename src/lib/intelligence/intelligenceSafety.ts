import {
  IntelligenceSafetyBand,
  IntelligenceConfidence,
  SymbolicInputSummary,
} from "./intelligenceTypes";

const EMAIL_PATTERN = "\\b[^\\s@]+@[^\\s@]+\\.[^\\s@]+\\b";
const PHONE_PATTERN = "(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}";
const GPS_PATTERN = "\\b[-+]?((?:[1-8]?\\d(?:\\.\\d+)?)|90(?:\\.0+)?)[\\s,]+[NS]?\\s*,?\\s*[-+]?((?:180(?:\\.0+)?)|(?:(?:1[0-7]\\d)|(?:[1-9]?\\d))(?:\\.\\d+)?)[\\s,]+[EW]?\\b";
const DECIMAL_GPS_PATTERN = "[-+]?(?:[1-8]?\\d(?:\\.\\d+)?|90(?:\\.0+)?),\\s*[-+]?(?:180(?:\\.0+)?|(?:1[0-7]\\d|[1-9]?\\d)(?:\\.\\d+)?)";
const CARD_PATTERN = "\\b(?:\\d[ -]*?){13,16}\\b";
const SSN_PATTERN = "\\b\\d{3}-\\d{2}-\\d{4}\\b";

function hasEmail(text: string): boolean {
  return new RegExp(EMAIL_PATTERN, "i").test(text);
}
function hasPhone(text: string): boolean {
  return new RegExp(PHONE_PATTERN, "i").test(text);
}
function hasGps(text: string): boolean {
  return new RegExp(GPS_PATTERN, "i").test(text) || new RegExp(DECIMAL_GPS_PATTERN, "i").test(text);
}
function hasCard(text: string): boolean {
  return new RegExp(CARD_PATTERN, "i").test(text);
}
function hasSsn(text: string): boolean {
  return new RegExp(SSN_PATTERN, "i").test(text);
}

export function clampScore(value: number): number {
  if (isNaN(value) || !isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value));
}

export function confidenceFromScore(score: number): IntelligenceConfidence {
  const clampedScore = clampScore(score);
  if (clampedScore < 40) {
    return "low";
  }
  if (clampedScore < 75) {
    return "medium";
  }
  return "high";
}

export function isLayerAllowedForSymbolicInference(
  layerId: string,
  openLayerIds: string[]
): boolean {
  return openLayerIds.includes(layerId);
}

function hasPII(text: string): boolean {
  return hasEmail(text) || hasPhone(text) || hasGps(text) || hasCard(text) || hasSsn(text);
}

export function shouldBlockRawSensitiveInput(
  input: SymbolicInputSummary
): boolean {
  if (input.containsSensitiveRawData) return true;
  if (hasPII(input.summary)) return true;

  const summary = input.summary.toLowerCase();

  const medicalKeywords = ["diagnosis", "disorder", "syndrome", "condition", "treatment", "clinical"];
  if (medicalKeywords.some(keyword => summary.includes(keyword))) {
    return true;
  }

  if (summary.length > 1000 && summary.split(" ").length > 150) {
    return true;
  }

  return false;
}

export function getSafetyBandForInput(
  input: SymbolicInputSummary
): IntelligenceSafetyBand {
  if (hasPII(input.summary)) {
    return "danger";
  }
  if (shouldBlockRawSensitiveInput(input)) {
    return "blocked";
  }
  if (input.tags?.includes("shadow") || input.tags?.includes("difficult_pattern")) {
    return "shadow_required";
  }
  if (input.tags?.includes("legacy") || input.tags?.includes("milestone")) {
    return "legacy_required";
  }
  if (input.tags?.includes("sensitive")) {
    return "sensitive";
  }
  return "safe";
}

export function sanitizeSymbolicSummary(text: string): string {
  let sanitized = text;

  sanitized = sanitized.replace(new RegExp(EMAIL_PATTERN, "gi"), "[REDACTED_EMAIL]");
  sanitized = sanitized.replace(new RegExp(PHONE_PATTERN, "gi"), "[REDACTED_PHONE]");
  sanitized = sanitized.replace(new RegExp(GPS_PATTERN, "gi"), "[REDACTED_GPS]");
  sanitized = sanitized.replace(new RegExp(DECIMAL_GPS_PATTERN, "gi"), "[REDACTED_GPS]");
  sanitized = sanitized.replace(new RegExp(CARD_PATTERN, "gi"), "[REDACTED_PAYMENT_CARD]");

  return sanitized.trim().slice(0, 500);
}

export function makeUncertaintyPrefix(confidence: IntelligenceConfidence): string {
  switch (confidence) {
    case "low":
      return "A faint pattern may be forming:";
    case "medium":
      return "A possible pattern is emerging:";
    case "high":
      return "A stronger symbolic pattern appears:";
    default:
      return "A faint pattern may be forming:";
  }
}
