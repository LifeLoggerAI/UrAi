"use client";

import { useCallback, useMemo } from "react";
import { useUraiAudio } from "@/providers/UraiAudioProvider";
import {
  groundPulseHaptic,
  orbWakeHaptic,
  passportPulseHaptic,
  portalOpenHaptic,
  softTapHaptic,
} from "@/lib/sensory/uraiHaptics";

type PortalType = "life-map" | "galaxy" | "mirror" | "shadow" | "legacy" | "passport" | "settings" | "ground" | "focus" | "replay";

const portalSoundMap: Partial<Record<PortalType, string>> = {
  "life-map": "galaxy-open",
  galaxy: "galaxy-open",
  mirror: "mirror-open",
  shadow: "shadow-open",
  legacy: "legacy-open",
  passport: "passport-open",
  settings: "settings-open",
  ground: "ground-open-bloom",
  focus: "soft-tap",
  replay: "life-map-swell",
};

export function useInteractionSound() {
  const audio = useUraiAudio();
  const hapticSettings = useMemo(
    () => ({
      hapticsEnabled: audio.settings.hapticsEnabled,
      reducedSensoryMode: audio.settings.reducedSensoryMode,
    }),
    [audio.settings.hapticsEnabled, audio.settings.reducedSensoryMode],
  );

  const ensureUnlocked = useCallback(async () => {
    if (audio.settings.enabled && !audio.isUnlocked) await audio.unlockAudio();
  }, [audio]);

  const playSoftTap = useCallback(async () => {
    softTapHaptic(hapticSettings);
    await ensureUnlocked();
    if (audio.settings.reducedSensoryMode) return;
    await audio.playOneShot("soft-tap", { category: "ui", volume: 0.18 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playOrbTap = useCallback(async () => {
    orbWakeHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("orb-tap", { category: "orb", volume: audio.settings.reducedSensoryMode ? 0.18 : 0.3 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playOrbWake = useCallback(async () => {
    orbWakeHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("orb-wake", { category: "orb", volume: audio.settings.reducedSensoryMode ? 0.18 : 0.28 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playPortalOpen = useCallback(
    async (type: PortalType) => {
      if (type === "ground") groundPulseHaptic(hapticSettings);
      else if (type === "passport") passportPulseHaptic(hapticSettings);
      else portalOpenHaptic(hapticSettings);

      await ensureUnlocked();
      const sound = portalSoundMap[type] ?? "soft-tap";
      const volume = audio.settings.reducedSensoryMode ? 0.14 : type === "shadow" ? 0.2 : 0.28;
      await audio.playOneShot(sound, { category: type === "replay" ? "transition" : "portal", volume });
      if (!audio.settings.reducedSensoryMode && (type === "life-map" || type === "galaxy")) {
        await audio.playOneShot("life-map-swell", { category: "transition", volume: 0.2 });
      }
      if (!audio.settings.reducedSensoryMode && type === "mirror") {
        await audio.playOneShot("mirror-ripple", { category: "transition", volume: 0.16 });
      }
      if (!audio.settings.reducedSensoryMode && type === "legacy") {
        await audio.playOneShot("legacy-scroll-open", { category: "transition", volume: 0.16 });
      }
    },
    [audio, ensureUnlocked, hapticSettings],
  );

  const playGroundOpen = useCallback(async () => {
    groundPulseHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("ground-open-bloom", { category: "transition", volume: audio.settings.reducedSensoryMode ? 0.12 : 0.2 });
    if (!audio.settings.reducedSensoryMode) await audio.playLoop("ground-soft-loop", { category: "ambient", volume: 0.12, fadeMs: 1600 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playPanelOpen = useCallback(async () => {
    softTapHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("panel-open", { category: "ui", volume: audio.settings.reducedSensoryMode ? 0.1 : 0.18 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playPanelClose = useCallback(async () => {
    softTapHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("panel-close", { category: "ui", volume: audio.settings.reducedSensoryMode ? 0.08 : 0.16 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playPermissionToggle = useCallback(async () => {
    softTapHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("permission-toggle", { category: "ui", volume: audio.settings.reducedSensoryMode ? 0.1 : 0.18 });
  }, [audio, ensureUnlocked, hapticSettings]);

  return {
    playOrbTap,
    playOrbWake,
    playPortalOpen,
    playGroundOpen,
    playPanelOpen,
    playPanelClose,
    playPermissionToggle,
    playSoftTap,
  };
}
