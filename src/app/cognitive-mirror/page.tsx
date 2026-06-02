import React from 'react';
import Card from '../../components/ui/Card';
import ChronoMirrorCard from '../../components/chrono/ChronoMirrorCard';
import ChronoResonanceActions from '../../components/chrono/ChronoResonanceActions';
import {
  ChronoRawUserData,
  computeChronoMirror,
  computeFeltTimeReplaySegments,
  mapUserDataToChronoSignals,
} from '../../lib/chronoMirror';
import { getLatestChronoMirrorSnapshot } from '../../lib/chronoMirrorRepository';
import {
  getChronoNarratorBinding,
  getChronoRiveBinding,
} from '../../lib/chronoAnalytics';
import { isFirebaseConfigured } from '../../lib/firebase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEMO_USER_ID = 'demo-user';
const CHRONO_FIRESTORE_TIMEOUT_MS = 2500;

const demoRawData: ChronoRawUserData = {
  moodScore: 0.34,
  stressScore: 0.76,
  sleepDebtHours: 4,
  uniqueLocationCount: 5,
  routineRepeatScore: 0.18,
  notificationFrictionScore: 0.61,
  journalEmotionScore: 0.82,
  socialGapScore: 0.63,
  flowSessionMinutes: 32,
  openLoopCount: 7,
  recoveryActionCount: 1,
  memoryAnchorCount: 9,
};

const demoChronoResult = computeChronoMirror(mapUserDataToChronoSignals(demoRawData));

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

function shouldUseChronoFirestore() {
  return process.env.URAI_ENABLE_CHRONO_FIRESTORE === '1';
}

async function loadChronoState() {
  if (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    !isFirebaseConfigured() ||
    !shouldUseChronoFirestore()
  ) {
    return demoChronoResult;
  }

  try {
    const existing = await withTimeout(
      getLatestChronoMirrorSnapshot(DEMO_USER_ID),
      CHRONO_FIRESTORE_TIMEOUT_MS,
      'ChronoMirror snapshot lookup',
    );
    return existing ?? demoChronoResult;
  } catch (error) {
    console.warn('ChronoMirror fallback mode active', error);
    return demoChronoResult;
  }
}

export default async function CognitiveMirrorPage() {
  const chronoResult = await loadChronoState();

  const riveBinding = getChronoRiveBinding(chronoResult);
  const narratorBinding = getChronoNarratorBinding(chronoResult);

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

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
              ChronoMirror
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Cognitive Mirror
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Subjective time perception, emotional density, replay pacing,
              symbolic thresholds, and temporal cognition modeling.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 backdrop-blur-xl">
            <p>Cloud opacity: {riveBinding.inputs.cloudOpacity.toFixed(2)}</p>
            <p>Narrator silence: {narratorBinding.silenceMs}ms</p>
          </div>
        </div>
      </div>

      <ChronoMirrorCard result={chronoResult} />

      <ChronoResonanceActions userId={DEMO_USER_ID} />

      <Card header="Felt-Time Replay">
        <div className="space-y-4">
          {replaySegments.map((segment) => (
            <div
              key={segment.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {segment.label}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Replay tempo · {segment.replayTempo}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-cyan-200">
                    {Math.round(segment.feltDurationPercent * 100)}%
                  </p>
                  <p className="text-xs text-white/40">felt duration</p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                  style={{ width: `${segment.feltDurationPercent * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card header="Chrono Runtime Bindings">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/70">
            <p className="mb-2 font-semibold text-white">Sky / Rive</p>
            <pre className="overflow-x-auto text-xs text-cyan-100/70">
              {JSON.stringify(riveBinding, null, 2)}
            </pre>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/70">
            <p className="mb-2 font-semibold text-white">Narrator</p>
            <pre className="overflow-x-auto text-xs text-violet-100/70">
              {JSON.stringify(narratorBinding, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
