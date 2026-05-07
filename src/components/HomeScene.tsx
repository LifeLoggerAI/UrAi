"use client";

import AncientSignalAmbientLayer from "@/components/ancient-signals/AncientSignalAmbientLayer";
import GroundLayer from "@/components/GroundLayer";
import { useAncientSignals } from "@/lib/useAncientSignals";

export default function HomeScene() {
  const { result: ancientResult, source, loading } = useAncientSignals();

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
      <AncientSignalAmbientLayer result={ancientResult} source={source} loading={loading} />

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
