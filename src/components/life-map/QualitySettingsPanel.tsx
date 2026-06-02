"use client";

import type { QualityMode } from "@/lib/life-map/types";

export default function QualitySettingsPanel(_props: {
  qualityMode: QualityMode;
  reducedMotion: boolean;
  highContrast: boolean;
  textOnlyFallback: boolean;
  emotionalSafetyMode: boolean;
  localOnlyMode: boolean;
  onQualityChange: (mode: QualityMode) => void;
  onToggleReducedMotion: () => void;
  onToggleHighContrast: () => void;
  onToggleTextOnly: () => void;
  onToggleEmotionalSafety: () => void;
  onToggleLocalOnly: () => void;
}) {
  return null;
}
