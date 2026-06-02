'use client';

import React, { useMemo, useState } from 'react';
import { ChronoMirrorResult } from '../../lib/chronoMirror';
import { getChronoNarratorBinding } from '../../lib/chronoAnalytics';

interface ChronoNarratorRuntimeProps {
  result: ChronoMirrorResult;
}

export default function ChronoNarratorRuntime({ result }: ChronoNarratorRuntimeProps) {
  const binding = useMemo(() => getChronoNarratorBinding(result), [result]);
  const [status, setStatus] = useState('Idle');

  async function previewNarration() {
    setStatus('Speaking...');

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(binding.prompt);
        utterance.rate = binding.ttsRate;
        utterance.pitch = binding.ttsPitch;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.warn('Narrator preview failed', error);
    }

    setTimeout(() => setStatus('Idle'), binding.silenceMs);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-violet-200/60">
        Chrono Narrator Runtime
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/70 md:grid-cols-4">
        <Metric label="TTS Rate" value={binding.ttsRate} />
        <Metric label="TTS Pitch" value={binding.ttsPitch} />
        <Metric label="Silence" value={binding.silenceMs / 1000} suffix="s" />
        <Metric label="Intensity" value={binding.emotionalIntensity} />
      </div>

      <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm text-white/70">
        {binding.prompt}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={previewNarration}
          className="rounded-full bg-violet-400/20 px-4 py-2 text-xs text-violet-100"
        >
          Preview narration
        </button>

        <p className="text-xs text-white/40">{status}</p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix = '',
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-3">
      <p className="text-white/40">{label}</p>
      <p className="mt-1 font-semibold text-white">
        {value.toFixed(2)}{suffix}
      </p>
    </div>
  );
}
