"use client";

import UraiResolvedHomeScene from "@/components/urai/UraiResolvedHomeScene";
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
      className="urai-home-world-cinematic"
    >
      <UraiResolvedHomeScene />
      <style jsx global>{`
        .urai-home-world-cinematic .minimal-orbit-nav,
        .urai-home-world-cinematic nav,
        .urai-home-world-cinematic [class*="nav"],
        .urai-home-world-cinematic [class*="dock"],
        .urai-home-world-cinematic .field-whisper,
        .urai-home-world-cinematic .return-home,
        .urai-home-world-cinematic [data-urai-home-accessibility],
        .urai-home-world-cinematic [class*="accessibility"],
        .urai-home-world-cinematic [class*="whisper"],
        .urai-home-world-cinematic [class*="copy"],
        .urai-home-world-cinematic [class*="caption"],
        .urai-home-world-cinematic [class*="label"] {
          display: none !important;
        }
      `}</style>
    </main>
  );
}
