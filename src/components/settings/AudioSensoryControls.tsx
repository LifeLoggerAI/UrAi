"use client";

import { useUraiAudio } from "@/providers/UraiAudioProvider";
import { useUraiVoice } from "@/providers/UraiVoiceProvider";
import { useInteractionSound } from "@/hooks/useInteractionSound";

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/62">
      <span>{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-white"
      />
    </label>
  );
}

export function AudioSensoryControls() {
  const audio = useUraiAudio();
  const voice = useUraiVoice();
  const sound = useInteractionSound();

  const toggleSound = async () => {
    const nextEnabled = !audio.settings.enabled;
    audio.setAudioEnabled(nextEnabled);
    if (nextEnabled) {
      await audio.unlockAudio();
      await sound.playOrbWake();
    }
  };

  const toggleVoice = async () => {
    const nextEnabled = !voice.voiceEnabled;
    if (nextEnabled) await audio.unlockAudio();
    voice.setVoiceEnabled(nextEnabled);
  };

  return (
    <section className="rounded-3xl border border-white/12 bg-black/20 p-5 text-white shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm uppercase tracking-[0.24em] text-white/78">Audio & Sensory</h2>
          <p className="mt-2 text-xs leading-5 text-white/50">Subtle sound, captions, voice, and haptics.</p>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          {audio.settings.enabled ? "Sound On" : "Sound Off"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Slider label="Master" value={audio.settings.masterVolume} onChange={audio.setMasterVolume} />
        <Slider label="Ambient" value={audio.settings.ambientVolume} onChange={audio.setAmbientVolume} />
        <Slider label="Effects" value={audio.settings.effectsVolume} onChange={audio.setEffectsVolume} />
        <Slider label="Voice" value={voice.voiceVolume} onChange={voice.setVoiceVolume} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggleVoice}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/68 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Voice {voice.voiceEnabled ? "On" : "Off"}
        </button>
        <button
          type="button"
          onClick={() => voice.setCaptionsEnabled(!voice.captionsEnabled)}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/68 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Captions {voice.captionsEnabled ? "On" : "Off"}
        </button>
        <button
          type="button"
          onClick={() => voice.setWhispersEnabled(!voice.whispersEnabled)}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/68 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Whispers {voice.whispersEnabled ? "On" : "Off"}
        </button>
        <button
          type="button"
          onClick={() => voice.setCouncilNarrationEnabled(!voice.councilNarrationEnabled)}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/68 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Council {voice.councilNarrationEnabled ? "On" : "Off"}
        </button>
        <button
          type="button"
          onClick={() => audio.setHapticsEnabled(!audio.settings.hapticsEnabled)}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/68 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Haptics {audio.settings.hapticsEnabled ? "On" : "Off"}
        </button>
        <button
          type="button"
          onClick={() => audio.setReducedSensoryMode(!audio.settings.reducedSensoryMode)}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/68 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Gentle Mode {audio.settings.reducedSensoryMode ? "On" : "Off"}
        </button>
      </div>
    </section>
  );
}
