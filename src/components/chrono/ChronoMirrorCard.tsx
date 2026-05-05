import React from 'react';
import Card from '../ui/Card';
import { ChronoMirrorResult } from '../../lib/chronoMirror';

interface ChronoMirrorCardProps {
  result: ChronoMirrorResult;
}

const percent = (value: number) => `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`;
const label = (value: string) => value.replace(/_/g, ' ');

export default function ChronoMirrorCard({ result }: ChronoMirrorCardProps) {
  return (
    <Card header="ChronoMirror">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Felt-time state</p>
          <h2 className="mt-1 text-2xl font-semibold capitalize">{result.perceivedSpeed}</h2>
          <p className="mt-2 text-sm text-white/70">{result.narratorPrompt}</p>
          <p className="mt-2 text-xs text-white/50">{result.trustLanguage}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          <Metric label="Time dilation" value={percent(result.timeDilationScore)} />
          <Metric label="Time compression" value={percent(result.timeCompressionScore)} />
          <Metric label="Reality density" value={percent(result.realityDensity)} />
          <Metric label="Memory density" value={percent(result.memoryDensity)} />
          <Metric label="Future horizon" value={percent(result.futureHorizon)} />
          <Metric label="Life drag" value={percent(result.lifeDragIndex)} />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
          <div className="flex flex-wrap gap-2">
            <Badge>Mode: {label(result.chronoTherapyMode)}</Badge>
            <Badge>Orientation: {label(result.temporalProfile.dominantOrientation)}</Badge>
            <Badge>Sky: {label(result.visualState.skyTempo)}</Badge>
          </div>
          {result.temporalProfile.recurrenceLoops.length > 0 && (
            <p className="mt-3 text-xs text-white/50">
              Recurrence loops: {result.temporalProfile.recurrenceLoops.map(label).join(', ')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/70">{children}</span>;
}
