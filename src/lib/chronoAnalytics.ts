import { recordChronoValidationEvent } from './chronoMirrorRepository';
import {
  ChronoMirrorResult,
  ChronoValidationEvent,
  buildChronoNarratorProfile,
  buildSkyRiveParams,
} from './chronoMirror';

export async function emitChronoAnalytics(
  userId: string,
  event: ChronoValidationEvent,
  snapshotId?: string,
) {
  return recordChronoValidationEvent(userId, event, snapshotId);
}

export function getChronoRiveBinding(result: ChronoMirrorResult) {
  const params = buildSkyRiveParams(result);
  return {
    stateMachine: 'ChronoSky',
    inputs: {
      particleVelocity: params.particleVelocity,
      particleDensity: params.particleDensity,
      cloudOpacity: params.cloudOpacity,
      auroraIntensity: params.auroraIntensity,
      fractureIntensity: params.fractureIntensity,
      dawnGlow: params.dawnGlow,
    },
  };
}

export function getChronoNarratorBinding(result: ChronoMirrorResult) {
  const narrator = buildChronoNarratorProfile(result);
  return {
    ttsRate:
      narrator.pacing === 'slow' ? 0.82 : narrator.pacing === 'light' ? 1.12 : 1,
    ttsPitch:
      narrator.tone.includes('rebirth') ? 1.08 : narrator.tone.includes('grief') ? 0.9 : 1,
    silenceMs: narrator.silenceMs,
    emotionalIntensity: narrator.intensity,
    prompt: narrator.prompt,
  };
}
