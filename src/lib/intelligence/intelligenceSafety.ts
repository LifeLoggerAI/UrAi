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

function hasPaymentCardLikeDigits(text: string): boolean {
  let digits = "";

  for (const char of text) {
    if (char >= "0" && char <= "9") {
      digits += char;
      if (digits.length > 19) digits = "";
      continue;
    }

    if ((char === " " || char === "-") && digits.length > 0) {
      continue;
    }

    if (digits.length >= 13 && digits.length <= 19) {
      return true;
    }

    digits = "";
  }

  return digits.length >= 13 && digits.length <= 19;
}

function redactPaymentCardLikeDigits(text: string): string {
  let result = "";
  let buffer = "";
  let digitCount = 0;

  const flush = () => {
    if (!buffer) return;
    result += digitCount >= 13 && digitCount <= 19 ? "[payment card removed]" : buffer;
    buffer = "";
    digitCount = 0;
  };

  for (const char of text) {
    if (char >= "0" && char <= "9") {
      buffer += char;
      digitCount += 1;
      if (digitCount > 19) flush();
      continue;
    }

    if ((char === " " || char === "-") && buffer) {
      buffer += char;
      continue;
    }

    flush();
    result += char;
  }

  flush();
  return result;
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
    
  if (hasPaymentCardLikeDigits(summary)) {
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

    sanitized = redactPaymentCardLikeDigits(sanitized);

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
