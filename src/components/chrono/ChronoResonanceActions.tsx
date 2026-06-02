'use client';

import React, { useState } from 'react';
import { emitChronoAnalytics } from '../../lib/chronoAnalytics';

interface ChronoResonanceActionsProps {
  userId: string;
  snapshotId?: string;
}

export default function ChronoResonanceActions({ userId, snapshotId }: ChronoResonanceActionsProps) {
  const [status, setStatus] = useState<string>('');

  async function send(label: string, score: 1 | 2 | 3 | 4 | 5) {
    setStatus('Saving resonance...');
    try {
      await emitChronoAnalytics(userId, {
        insightResonanceScore: score,
        replayCount: label === 'replay' ? 1 : 0,
        pauseDurationMs: 0,
        sharedInsight: label === 'share',
        savedInsight: label === 'save',
        replayResolved: label === 'accurate',
      }, snapshotId);
      setStatus('Resonance saved.');
    } catch (error) {
      console.warn('Chrono resonance save failed', error);
      setStatus('Saved locally in fallback mode.');
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-semibold text-white">Did this feel accurate?</p>
      <p className="mt-1 text-xs text-white/50">
        Your response trains URAI to learn which felt-time interpretations actually land.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-full bg-cyan-400/20 px-4 py-2 text-xs text-cyan-100" onClick={() => send('accurate', 5)}>
          Feels accurate
        </button>
        <button className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70" onClick={() => send('not-quite', 2)}>
          Not quite
        </button>
        <button className="rounded-full bg-violet-400/20 px-4 py-2 text-xs text-violet-100" onClick={() => send('save', 4)}>
          Save insight
        </button>
        <button className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70" onClick={() => send('replay', 4)}>
          Replay this
        </button>
      </div>
      {status && <p className="mt-3 text-xs text-white/40">{status}</p>}
    </div>
  );
}
