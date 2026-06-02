'use client';

import React from 'react';
import { ChronoMirrorResult } from '../../lib/chronoMirror';
import { getChronoRiveBinding } from '../../lib/chronoAnalytics';

interface ChronoSkyRuntimeProps {
  result: ChronoMirrorResult;
}

export default function ChronoSkyRuntime({ result }: ChronoSkyRuntimeProps) {
  const binding = getChronoRiveBinding(result);

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-5 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            binding.inputs.auroraIntensity > 0
              ? 'radial-gradient(circle at top, rgba(45,212,191,0.35), transparent 60%)'
              : binding.inputs.fractureIntensity > 0
                ? 'linear-gradient(135deg, rgba(244,63,94,0.2), transparent)'
                : 'radial-gradient(circle at top, rgba(59,130,246,0.2), transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/60">
          Chrono Sky Runtime
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/70 md:grid-cols-3">
          <Metric label="Particle Velocity" value={binding.inputs.particleVelocity} />
          <Metric label="Particle Density" value={binding.inputs.particleDensity} />
          <Metric label="Cloud Opacity" value={binding.inputs.cloudOpacity} />
          <Metric label="Aurora" value={binding.inputs.auroraIntensity} />
          <Metric label="Fracture" value={binding.inputs.fractureIntensity} />
          <Metric label="Dawn Glow" value={binding.inputs.dawnGlow} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 backdrop-blur-xl">
      <p className="text-white/40">{label}</p>
      <p className="mt-1 font-semibold text-white">{value.toFixed(2)}</p>
    </div>
  );
}
