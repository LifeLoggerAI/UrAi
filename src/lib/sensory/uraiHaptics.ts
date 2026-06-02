export type HapticSettings = {
  hapticsEnabled?: boolean;
  reducedSensoryMode?: boolean;
};

function vibrate(pattern: number | number[], settings: HapticSettings = {}): void {
  if (typeof navigator === "undefined") return;
  if (!settings.hapticsEnabled) return;
  if (settings.reducedSensoryMode) return;
  if (typeof navigator.vibrate !== "function") return;

  try {
    navigator.vibrate(pattern);
  } catch {
    return;
  }
}

export function softTapHaptic(settings?: HapticSettings): void {
  vibrate([12], settings);
}

export function orbWakeHaptic(settings?: HapticSettings): void {
  vibrate([18, 30, 18], settings);
}

export function portalOpenHaptic(settings?: HapticSettings): void {
  vibrate([20, 40, 30], settings);
}

export function passportPulseHaptic(settings?: HapticSettings): void {
  vibrate([16, 24, 16, 24, 24], settings);
}

export function groundPulseHaptic(settings?: HapticSettings): void {
  vibrate([30, 60, 30], settings);
}

export function notificationHaptic(settings?: HapticSettings): void {
  vibrate([20, 80, 20], settings);
}
