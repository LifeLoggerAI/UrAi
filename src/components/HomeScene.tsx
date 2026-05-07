"use client";

import AncientSignalAmbientLayer from "@/components/ancient-signals/AncientSignalAmbientLayer";
import CompanionChat from "@/components/CompanionChat";
import ForecastCard from "@/components/ForecastCard";
import GroundLayer from "@/components/GroundLayer";
import WaitlistForm from "@/components/WaitlistForm";
import WeeklyReflectionCard from "@/components/WeeklyReflectionCard";
import {adamClampDemoProfile} from "@/lib/demo-data";
import {useAncientSignals} from "@/lib/useAncientSignals";

export default function HomeScene() {
  const profile = adamClampDemoProfile;
  const {result: ancientResult, source, loading} = useAncientSignals();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-black to-black" />
      <AncientSignalAmbientLayer result={ancientResult} source={source} loading={loading} />
      <GroundLayer
        forcedTier={profile.symbolicState.groundTier}
        state={{
          moodScore: ancientResult.auraAtmosphere.warmth,
          rhythmState: ancientResult.preverbalState === "recovering" ? "recovering" : ancientResult.preverbalState === "activated" ? "overstimulated" : "stable",
          recoveryScore: ancientResult.recoveryPulseScore,
          vitalityScore: ancientResult.seekingScore,
          symbolicIntensity: ancientResult.signalDepth.auraAtmosphere,
          shadowStress: ancientResult.activationScore,
        }}
      />

      <section className="relative z-20 mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-between px-5 py-8">
        <div className="max-w-3xl pt-10">
          <p className="text-xs uppercase tracking-[0.45em] text-white/50">URAI V1 Demo Spine</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            A passive emotional operating system for memory, mood, and meaning.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            This route renders the core loop: symbolic environment, mood forecast, weekly reflection, companion narrator, and Ancient Signals body-weather.
          </p>
          <a href="/u/adamclamp" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
            Open public constellation
          </a>
        </div>

        <div className="grid gap-4 pb-4 md:grid-cols-2 lg:grid-cols-4">
          <ForecastCard forecast={profile.moodForecast} />
          <WeeklyReflectionCard reflection={profile.weeklyReflection} />
          <CompanionChat />
          <WaitlistForm source="home" />
        </div>
      </section>
    </main>
  );
}
