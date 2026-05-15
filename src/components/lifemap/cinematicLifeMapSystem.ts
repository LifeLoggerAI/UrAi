import type { LifeMapTone, MemoryStar } from './lifeMapTypes';

export type CameraPhase =
  | 'idle'
  | 'preAscent'
  | 'ascending'
  | 'lifeMap'
  | 'focusing'
  | 'focusedMemory'
  | 'replayIntro'
  | 'replaying'
  | 'replayPaused'
  | 'replayExit'
  | 'returningHome';

export type SceneDepth = 'ground' | 'sky' | 'map' | 'focus' | 'replay';

export type CinematicEase = [number, number, number, number];

export type CameraPhaseConfig = {
  phase: CameraPhase;
  scale: number;
  x: number;
  y: number;
  depth: SceneDepth;
  blur: number;
  opacity: number;
  activeLayers: string[];
  interactionLocked: boolean;
  narratorEligible: boolean;
  gestureSupport: 'none' | 'tap' | 'panZoom' | 'scrub';
  durationMs: number;
  easing: CinematicEase;
  validNext: CameraPhase[];
};

export type CameraTransform = {
  scale: number;
  x: number;
  y: number;
  blur: number;
  opacity: number;
  durationMs: number;
  easing: CinematicEase;
};

export type ReplayBeatType = 'stable' | 'strained' | 'recovery' | 'ritual' | 'threshold' | 'rebirth' | 'reflection';

export type ReplayCameraTarget = {
  x: number;
  y: number;
  scale: number;
  depth: number;
};

export type ReplayBeat = {
  id: string;
  eraId: string;
  timestamp: string;
  starId: string;
  beatType: ReplayBeatType;
  cameraTarget: ReplayCameraTarget;
  durationMs: number;
  narratorCueId?: string;
  narratorLine: string;
  emotionalWeatherState: LifeMapTone;
  auraState: string;
  transitionStyle: 'drift' | 'bloom' | 'threadTrace' | 'thresholdPulse' | 'softCut';
  importanceScore: number;
};

export type ReplayEra = {
  id: string;
  title: string;
  subtitle: string;
  startedAt: string;
  endedAt: string;
  beatIds: string[];
  defaultDurationMs: number;
};

export const cinematicEase = {
  ascent: [0.19, 1, 0.22, 1] as CinematicEase,
  focus: [0.16, 1, 0.3, 1] as CinematicEase,
  replay: [0.33, 1, 0.68, 1] as CinematicEase,
  return: [0.4, 0, 0.2, 1] as CinematicEase,
};

export const cameraPhaseMap: Record<CameraPhase, CameraPhaseConfig> = {
  idle: { phase: 'idle', scale: 1, x: 0, y: 0, depth: 'ground', blur: 0, opacity: 1, activeLayers: ['home', 'aura', 'weather'], interactionLocked: false, narratorEligible: true, gestureSupport: 'tap', durationMs: 0, easing: cinematicEase.return, validNext: ['preAscent'] },
  preAscent: { phase: 'preAscent', scale: 0.96, x: 0, y: 2, depth: 'sky', blur: 0.2, opacity: 1, activeLayers: ['home', 'sky', 'aura'], interactionLocked: true, narratorEligible: false, gestureSupport: 'none', durationMs: 220, easing: cinematicEase.ascent, validNext: ['ascending'] },
  ascending: { phase: 'ascending', scale: 1.1, x: 0, y: -9, depth: 'sky', blur: 0.6, opacity: 0.96, activeLayers: ['sky', 'stars', 'weather'], interactionLocked: true, narratorEligible: true, gestureSupport: 'none', durationMs: 980, easing: cinematicEase.ascent, validNext: ['lifeMap'] },
  lifeMap: { phase: 'lifeMap', scale: 1, x: 0, y: 0, depth: 'map', blur: 0, opacity: 1, activeLayers: ['stars', 'threads', 'controls'], interactionLocked: false, narratorEligible: true, gestureSupport: 'panZoom', durationMs: 420, easing: cinematicEase.ascent, validNext: ['focusing', 'replayIntro', 'returningHome'] },
  focusing: { phase: 'focusing', scale: 1.18, x: 0, y: 0, depth: 'focus', blur: 0.8, opacity: 0.86, activeLayers: ['selectedStar', 'threads', 'bloom'], interactionLocked: true, narratorEligible: false, gestureSupport: 'none', durationMs: 520, easing: cinematicEase.focus, validNext: ['focusedMemory'] },
  focusedMemory: { phase: 'focusedMemory', scale: 1.16, x: 0, y: 0, depth: 'focus', blur: 0.4, opacity: 1, activeLayers: ['selectedStar', 'bloom', 'trust'], interactionLocked: false, narratorEligible: true, gestureSupport: 'tap', durationMs: 280, easing: cinematicEase.focus, validNext: ['lifeMap', 'replayIntro', 'replayExit'] },
  replayIntro: { phase: 'replayIntro', scale: 1.04, x: 0, y: 0, depth: 'replay', blur: 0.2, opacity: 1, activeLayers: ['path', 'beats', 'narrator'], interactionLocked: true, narratorEligible: true, gestureSupport: 'none', durationMs: 460, easing: cinematicEase.replay, validNext: ['replaying', 'replayPaused'] },
  replaying: { phase: 'replaying', scale: 1.24, x: 0, y: 0, depth: 'replay', blur: 0.1, opacity: 1, activeLayers: ['path', 'beats', 'weather', 'narrator'], interactionLocked: false, narratorEligible: true, gestureSupport: 'scrub', durationMs: 0, easing: cinematicEase.replay, validNext: ['replayPaused', 'replayExit'] },
  replayPaused: { phase: 'replayPaused', scale: 1.18, x: 0, y: 0, depth: 'replay', blur: 0, opacity: 1, activeLayers: ['path', 'beats', 'controls'], interactionLocked: false, narratorEligible: false, gestureSupport: 'scrub', durationMs: 160, easing: cinematicEase.replay, validNext: ['replaying', 'replayExit'] },
  replayExit: { phase: 'replayExit', scale: 1.02, x: 0, y: 0, depth: 'map', blur: 0.2, opacity: 1, activeLayers: ['stars', 'threads'], interactionLocked: true, narratorEligible: false, gestureSupport: 'none', durationMs: 420, easing: cinematicEase.return, validNext: ['lifeMap', 'focusedMemory'] },
  returningHome: { phase: 'returningHome', scale: 0.92, x: 0, y: 6, depth: 'ground', blur: 0.4, opacity: 0.94, activeLayers: ['sky', 'home'], interactionLocked: true, narratorEligible: false, gestureSupport: 'none', durationMs: 760, easing: cinematicEase.return, validNext: ['idle'] },
};

export function canTransition(from: CameraPhase, to: CameraPhase) {
  return cameraPhaseMap[from].validNext.includes(to);
}

export function phaseTransform(phase: CameraPhase): CameraTransform {
  const config = cameraPhaseMap[phase];
  return { scale: config.scale, x: config.x, y: config.y, blur: config.blur, opacity: config.opacity, durationMs: config.durationMs, easing: config.easing };
}

export function focusTransformForStar(star: MemoryStar | null): CameraTransform {
  if (!star) return phaseTransform('lifeMap');
  return {
    scale: 1.16,
    x: (50 - star.position.x) * 0.34,
    y: (50 - star.position.y) * 0.26,
    blur: 0.45,
    opacity: 1,
    durationMs: 520,
    easing: cinematicEase.focus,
  };
}

function beatTypeFor(star: MemoryStar): ReplayBeatType {
  if (star.starType === 'threshold_moment') return 'threshold';
  if (star.starType === 'ritual_completion') return 'ritual';
  if (star.emotionalTone === 'recovery') return 'recovery';
  if (star.emotionalTone === 'rebirth') return 'rebirth';
  if (star.emotionalTone === 'stress' || star.emotionalTone === 'shadow') return 'strained';
  return 'stable';
}

function transitionStyleFor(beatType: ReplayBeatType): ReplayBeat['transitionStyle'] {
  if (beatType === 'threshold') return 'thresholdPulse';
  if (beatType === 'ritual' || beatType === 'recovery' || beatType === 'rebirth') return 'bloom';
  return 'threadTrace';
}

export function buildReplayBeats(stars: MemoryStar[], eraId = 'current-era'): ReplayBeat[] {
  return stars
    .filter((star) => star.replayEligible !== false)
    .sort((a, b) => new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime())
    .map((star, index) => {
      const beatType = beatTypeFor(star);
      return {
        id: `${eraId}-beat-${star.id}`,
        eraId,
        timestamp: String(star.timestamp ?? new Date().toISOString()),
        starId: star.id,
        beatType,
        cameraTarget: { x: star.position.x, y: star.position.y, scale: 1.12 + Math.min(0.32, star.importanceScore * 0.22), depth: star.position.z ?? 0 },
        durationMs: 2200 + Math.round(star.importanceScore * 1200) + index * 80,
        narratorCueId: star.narratorCueId,
        narratorLine: star.narratorLine,
        emotionalWeatherState: star.emotionalTone,
        auraState: star.auraColor ?? star.emotionalTone,
        transitionStyle: transitionStyleFor(beatType),
        importanceScore: star.importanceScore,
      };
    });
}

export function interpolateReplayBeat(beats: ReplayBeat[], elapsedMs: number) {
  if (beats.length === 0) return { beat: null, index: -1, progress: 0, totalMs: 0 };
  const totalMs = beats.reduce((sum, beat) => sum + beat.durationMs, 0);
  const clamped = Math.max(0, Math.min(elapsedMs, totalMs));
  let cursor = 0;
  for (let index = 0; index < beats.length; index += 1) {
    const beat = beats[index];
    const next = cursor + beat.durationMs;
    if (clamped <= next) return { beat, index, progress: (clamped - cursor) / beat.durationMs, totalMs };
    cursor = next;
  }
  return { beat: beats[beats.length - 1], index: beats.length - 1, progress: 1, totalMs };
}
