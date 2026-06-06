import {
  IntelligenceSafetyBand,
  IntelligenceConfidence,
  SymbolicInputSummary,
} from "./intelligenceTypes";

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

export function shouldBlockRawSensitiveInput(
  input: SymbolicInputSummary
): boolean {
  if (input.containsSensitiveRawData) {
    return true;
  }

  const summary = input.summary.toLowerCase();

  // Basic regex for GPS coordinates
  const gpsRegex = /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/;
  if (gpsRegex.test(summary)) {
    return true;
  }

  // Basic regex for email
  const emailRegex = /\S+@\S+\.\S+/;
  if (emailRegex.test(summary)) {
    return true;
  }

  // Basic regex for phone numbers (very basic)
  const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  if (phoneRegex.test(summary)) {
    return true;
  }
    
  // Basic regex for payment cards
  const cardRegex = /\b(?:\d[ -]*?){13,16}\b/;
  if (cardRegex.test(summary)) {
    return true;
  }

  // Basic regex for SSN
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/;
  if (ssnRegex.test(summary)) {
      return true;
  }

  // Keywords for medical diagnosis
  const medicalKeywords = ["diagnosis", "disorder", "syndrome", "condition", "treatment", "clinical"];
  if (medicalKeywords.some(keyword => summary.includes(keyword))) {
    return true;
  }
    
  // Check for long raw-like content
  if (summary.length > 1000 && summary.split(" ").length > 150) {
      return true;
  }

  return false;
}

export function getSafetyBandForInput(
  input: SymbolicInputSummary
): IntelligenceSafetyBand {
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

    const emailRegex = /\S+@\S+\.\S+/g;
    sanitized = sanitized.replace(emailRegex, "[email removed]");

    const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
    sanitized = sanitized.replace(phoneRegex, "[phone number removed]");

    const gpsRegex = /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g;
    sanitized = sanitized.replace(gpsRegex, "[location removed]");

    const cardRegex = /\b(?:\d[ -]*?){13,16}\b/g;
    sanitized = sanitized.replace(cardRegex, "[payment card removed]");

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
