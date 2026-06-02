"use client";

import { useCallback } from "react";
import { useUraiAudio } from "@/providers/UraiAudioProvider";
import {
  groundPulseHaptic,
  orbWakeHaptic,
  passportPulseHaptic,
  portalOpenHaptic,
  softTapHaptic,
} from "@/lib/sensory/uraiHaptics";

type PortalType = "life-map" | "galaxy" | "mirror" | "shadow" | "legacy" | "passport" | "ground" | "focus" | "replay";

const portalSoundMap: Partial<Record<PortalType, string>> = {
  "life-map": "galaxy-open",
  galaxy: "galaxy-open",
  mirror: "mirror-open",
  shadow: "shadow-open",
  legacy: "legacy-open",
  passport: "passport-open",
  ground: "soft-tap",
  focus: "soft-tap",
  replay: "life-map-swell",
};

export function useInteractionSound() {
  const audio = useUraiAudio();
  const hapticSettings = {
    hapticsEnabled: audio.settings.hapticsEnabled,
    reducedSensoryMode: audio.settings.reducedSensoryMode,
  };

  const ensureUnlocked = useCallback(async () => {
    if (audio.settings.enabled && !audio.isUnlocked) await audio.unlockAudio();
  }, [audio]);

  const playSoftTap = useCallback(async () => {
    softTapHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("soft-tap", { category: "ui", volume: 0.26 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playOrbTap = useCallback(async () => {
    orbWakeHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("orb-tap", { category: "orb", volume: 0.38 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playOrbWake = useCallback(async () => {
    orbWakeHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("orb-wake", { category: "orb", volume: 0.32 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playPortalOpen = useCallback(
    async (type: PortalType) => {
      if (type === "ground") groundPulseHaptic(hapticSettings);
      else if (type === "passport") passportPulseHaptic(hapticSettings);
      else portalOpenHaptic(hapticSettings);

      await ensureUnlocked();
      const sound = portalSoundMap[type] ?? "soft-tap";
      await audio.playOneShot(sound, { category: type === "replay" ? "transition" : "portal", volume: type === "shadow" ? 0.24 : 0.34 });
      if (type === "life-map" || type === "galaxy") {
        await audio.playOneShot("life-map-swell", { category: "transition", volume: 0.24 });
      }
    },
    [audio, ensureUnlocked, hapticSettings],
  );

  const playGroundOpen = useCallback(async () => {
    groundPulseHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("soft-tap", { category: "ui", volume: 0.24 });
    await audio.playLoop("ground-soft-loop", { category: "ambient", volume: 0.14, fadeMs: 1600 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playPanelOpen = useCallback(async () => {
    softTapHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("panel-open", { category: "ui", volume: 0.24 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playPanelClose = useCallback(async () => {
    softTapHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("panel-close", { category: "ui", volume: 0.22 });
  }, [audio, ensureUnlocked, hapticSettings]);

  const playPermissionToggle = useCallback(async () => {
    softTapHaptic(hapticSettings);
    await ensureUnlocked();
    await audio.playOneShot("permission-toggle", { category: "ui", volume: 0.26 });
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
