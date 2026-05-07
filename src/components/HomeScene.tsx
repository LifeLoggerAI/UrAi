"use client";

import AncientSignalAmbientLayer from "@/components/ancient-signals/AncientSignalAmbientLayer";
import GroundLayer from "@/components/GroundLayer";
import { computeAncientSignals, mapUserDataToAncientSignals } from "@/lib/ancientSignals";

export default function HomeScene() {
  const ancientResult = computeAncientSignals(
    mapUserDataToAncientSignals({
      moodScore: 0.52,
      stressScore: 0.46,
      sleepDebtHours: 3,
      notificationFrictionScore: 0.38,
      socialGapScore: 0.42,
      recoveryActionCount: 2,
      lateNightUseScore: 0.28,
      frictionTapScore: 0.32,
      hesitationScore: 0.34,
      cancelLoopScore: 0.24,
      scrollVelocityScore: 0.36,
      pauseDensity: 0.22,
      voiceTension: 0.3,
      speechCompression: 0.26,
      wordDisclosure: 0.48,
    }),
  );

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      {/* SKY */}
      <video
        src="/assets/sky/sky-demo.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ANCIENT SIGNALS ATMOSPHERE */}
      <AncientSignalAmbientLayer result={ancientResult} />

      {/* GROUND (RECOVERY + BODY-WEATHER AWARE) */}
      <GroundLayer
        state={{
          moodScore: ancientResult.auraAtmosphere.warmth,
          rhythmState: ancientResult.preverbalState === "recovering" ? "recovering" : ancientResult.preverbalState === "activated" ? "overstimulated" : "stable",
          recoveryScore: ancientResult.recoveryPulseScore,
          vitalityScore: ancientResult.seekingScore,
          symbolicIntensity: ancientResult.signalDepth.auraAtmosphere,
          shadowStress: ancientResult.activationScore,
        }}
      />

      {/* AVATAR */}
      <video
        src="/assets/avatar/avatar-demo.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
  );
}
