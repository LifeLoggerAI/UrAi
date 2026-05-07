import React from 'react';
import Card from '../ui/Card';
import { AncientSignalResult } from '../../lib/ancientSignals';

interface AncientSignalCardProps {
  result: AncientSignalResult;
}

const percent = (value: number) => `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`;
const label = (value: string) => value.replace(/_/g, ' ');

export default function AncientSignalCard({ result }: AncientSignalCardProps) {
  return (
    <Card header="Ancient Signals">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Signal beneath speech
          </p>
          <h2 className="mt-1 text-2xl font-semibold capitalize">
            {label(result.preverbalState)}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {result.narratorHint.messageSeed}
          </p>
          <p className="mt-2 text-xs text-white/45">
            URAI reads this as a gentle before-words pattern, not a diagnosis or certainty claim.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          <Metric label="Activation" value={percent(result.activationScore)} />
          <Metric label="Distance" value={percent(result.withdrawalScore)} />
          <Metric label="Recovery pulse" value={percent(result.recoveryPulseScore)} />
          <Metric label="Still signal" value={percent(result.numbnessScore)} />
          <Metric label="Seeking" value={percent(result.seekingScore)} />
          <Metric label="Confidence" value={percent(result.confidence)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">
              Aura atmosphere
            </p>
            <SignalBar label="Warmth" value={result.auraAtmosphere.warmth} />
            <SignalBar label="Heaviness" value={result.auraAtmosphere.heaviness} />
            <SignalBar label="Static charge" value={result.auraAtmosphere.staticCharge} />
            <SignalBar label="Haze" value={result.auraAtmosphere.haze} />
            <SignalBar label="Bloom potential" value={result.auraAtmosphere.bloomPotential} />
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">
              Toward / away vector
            </p>
            <SignalBar label="Toward people" value={result.towardAwayVector.towardPeople} />
            <SignalBar label="Away from people" value={result.towardAwayVector.awayFromPeople} />
            <SignalBar label="Toward rest" value={result.towardAwayVector.towardRest} />
            <SignalBar label="Toward meaning" value={result.towardAwayVector.towardMeaning} />
            <SignalBar label="Away from meaning" value={result.towardAwayVector.awayFromMeaning} />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div className="flex flex-wrap gap-2">
            <Badge>Mode: {label(result.narratorHint.mode)}</Badge>
            <Badge>Tone: {label(result.narratorHint.tone)}</Badge>
            <Badge>Speak: {result.narratorHint.shouldSpeak ? 'yes' : 'no'}</Badge>
          </div>
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

function SignalBar({ label, value }: { label: string; value: number }) {
  const safeValue = Math.max(0, Math.min(1, value));

  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between gap-3 text-xs text-white/55">
        <span>{label}</span>
        <span>{percent(safeValue)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
          style={{ width: `${safeValue * 100}%` }}
        />
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/70">{children}</span>;
}
