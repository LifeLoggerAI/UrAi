'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { createFrameDiagnosticSampler, type LegacyFrameMetrics } from '@/lib/runtime/frame-diagnostics';

export function LegacyFrameSampler({ onSample }: { onSample: (sample: LegacyFrameMetrics) => void }) {
  const sampler = useMemo(() => createFrameDiagnosticSampler(), []);
  useFrame((state, delta) => {
    const sample = sampler.sample(delta, state.gl.info);
    if (sample) onSample(sample);
  });
  return null;
}

function value(number: number | null | undefined, decimals = 0): string {
  return typeof number === 'number' && Number.isFinite(number) ? number.toFixed(decimals) : '—';
}

/** Developer counters only. Frame duration is not CPU work or GPU timing. */
export function LegacyFrameOverlay({ sample }: { sample: LegacyFrameMetrics | null }) {
  return (
    <div
      aria-hidden="true"
      data-urai-frame-diagnostics="local"
      className="pointer-events-none fixed bottom-3 left-3 z-[90] rounded-md bg-black/75 px-2 py-1 font-mono text-[10px] text-white"
    >
      <div>FPS {value(sample?.framesPerSecond, 1)} · Frame {value(sample?.frameMilliseconds, 1)} ms</div>
      <div>Calls {value(sample?.drawCalls)} · Triangles {value(sample?.triangles)}</div>
      <div>Points {value(sample?.points)} · Lines {value(sample?.lines)}</div>
      <div>Geometries {value(sample?.geometries)} · Textures {value(sample?.textures)}</div>
      <div>GPU timing unavailable</div>
    </div>
  );
}
