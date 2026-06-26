"use client";

import UraiResolvedHomeScene from "@/components/urai/UraiResolvedHomeScene.new";
import UraiHomeAccessibilityLayer from "@/components/urai/UraiHomeAccessibilityLayer";
import { orbStateForHomeWorld } from "@/lib/home-world";
import { useUraiHomeWorldState } from "@/lib/use-urai-home-world-state";

export default function UraiHomeLaunchSurface() {
  const homeWorld = useUraiHomeWorldState();
  const orbState = orbStateForHomeWorld(homeWorld);

  return (
    <main
      data-ground-tier={homeWorld.groundTier}
      data-orb-tier={homeWorld.orbTier}
      data-sky-tier={homeWorld.skyTier}
      data-mood={homeWorld.moodState}
      data-recovery={homeWorld.recoveryState}
      data-narrator-speaking={homeWorld.narratorSpeaking}
      data-orb-state={orbState}
      data-energy-score={Math.round(homeWorld.energyScore)}
      data-orb-pulse-intensity={homeWorld.orbPulseIntensity.toFixed(2)}
      data-sky-weather-intensity={homeWorld.skyWeatherIntensity.toFixed(2)}
      data-ground-growth-intensity={homeWorld.groundGrowthIntensity.toFixed(2)}
      aria-label="URAI Home World"
    >
      <UraiResolvedHomeScene />
      <UraiHomeAccessibilityLayer />
    </main>
  );
}
