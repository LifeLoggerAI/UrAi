import React from 'react';
import Card from '../../components/ui/Card';
import ChronoMirrorCard from '../../components/chrono/ChronoMirrorCard';
import { computeChronoMirror, computeFeltTimeReplaySegments } from '../../lib/chronoMirror';

const chronoResult = computeChronoMirror({
  emotionalIntensity: 0.82,
  positiveValence: 0.34,
  stressLoad: 0.76,
  noveltyDensity: 0.71,
  routineDensity: 0.18,
  uncertaintyLoad: 0.69,
  memoryAnchorCount: 9,
  socialSilenceLoad: 0.63,
  sleepDebt: 0.58,
  deviceFriction: 0.61,
  flowContinuity: 0.21,
  replayLoopLoad: 0.72,
  anticipationLoad: 0.66,
  recoverySignal: 0.39,
});

const replaySegments = computeFeltTimeReplaySegments([
  {
    id: 'monday',
    label: 'Monday Threshold',
    signals: {
      emotionalIntensity: 0.91,
      stressLoad: 0.83,
      uncertaintyLoad: 0.76,
      memoryAnchorCount: 10,
      replayLoopLoad: 0.72,
      anticipationLoad: 0.61,
    },
  },
  {
    id: 'tuesday',
    label: 'Tuesday Blur',
    signals: {
      emotionalIntensity: 0.12,
      routineDensity: 0.91,
      noveltyDensity: 0.11,
      flowContinuity: 0.62,
      memoryAnchorCount: 1,
    },
  },
  {
    id: 'friday',
    label: 'Friday Recovery',
    signals: {
      emotionalIntensity: 0.58,
      positiveValence: 0.62,
      recoverySignal: 0.78,
      noveltyDensity: 0.51,
      memoryAnchorCount: 7,
    },
  },
]);

export default function CognitiveMirrorPage() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold mb-4">Cognitive Mirror</h1>

      <ChronoMirrorCard result={chronoResult} />

      <Card header="Felt-Time Replay">
        <div className="space-y-3">
          {replaySegments.map((segment) => (
            <div
              key={segment.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{segment.label}</h3>
                  <p className="text-xs text-white/50">
                    Replay tempo: {segment.replayTempo}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {Math.round(segment.feltDurationPercent * 100)}%
                  </p>
                  <p className="text-xs text-white/50">felt duration</p>
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white/70"
                  style={{ width: `${segment.feltDurationPercent * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card header="Mood Trends">
        <p>This is where the user's mood trends will be displayed.</p>
        <div className="w-full h-64 bg-white/10 rounded-lg mt-4"></div>
      </Card>
    </div>
  );
}
