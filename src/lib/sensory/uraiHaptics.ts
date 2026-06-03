export type HapticSettings = {
  hapticsEnabled?: boolean;
  reducedSensoryMode?: boolean;
};

let lastVibrationAt = 0;
const MIN_INTERVAL_MS = 220;

function softenPattern(pattern: number | number[]): number | number[] {
  if (Array.isArray(pattern)) return pattern.map((value) => Math.max(8, Math.round(value * 0.45))).slice(0, 3);
  return Math.max(8, Math.round(pattern * 0.45));
}

function vibrate(pattern: number | number[], settings: HapticSettings = {}): void {
  if (typeof navigator === "undefined") return;
  if (!settings.hapticsEnabled) return;
  if (typeof navigator.vibrate !== "function") return;
  const now = Date.now();
  if (now - lastVibrationAt < MIN_INTERVAL_MS) return;
  lastVibrationAt = now;

  try {
    navigator.vibrate(settings.reducedSensoryMode ? softenPattern(pattern) : pattern);
  } catch {
    return;
  }
}

export function softTapHaptic(settings?: HapticSettings): void {
  vibrate([10], settings);
}

export function orbWakeHaptic(settings?: HapticSettings): void {
  vibrate([14, 24, 14], settings);
}

export function portalOpenHaptic(settings?: HapticSettings): void {
  vibrate([16, 32, 22], settings);
}

export function passportPulseHaptic(settings?: HapticSettings): void {
  vibrate([12, 20, 12], settings);
}

export function groundPulseHaptic(settings?: HapticSettings): void {
  vibrate([18, 34, 18], settings);
}

export function notificationHaptic(settings?: HapticSettings): void {
  vibrate([12, 32, 12], settings);
}
