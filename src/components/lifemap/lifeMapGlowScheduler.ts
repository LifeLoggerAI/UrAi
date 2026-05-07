import type { MemoryEmotion } from './lifeMapEvents';

export type StarState = 'idle' | 'glowing' | 'active' | 'resolved';

export type GlowCandidate = {
  id: string;
  emotion: MemoryEmotion;
  state: StarState;
  intensity: number;
  recency: number;
  unresolvedWeight: number;
};

export type GlowHistoryEntry = {
  tick: number;
  ids: string[];
};

type GlowSchedulerOptions = {
  count: number;
  tick: number;
  minTicksBetweenGlows: number;
  repeatWindowTicks: number;
  maxRepeatsPerWindow: number;
};

const EMOTION_SCORE: Record<MemoryEmotion, number> = {
  threshold: 3,
  grief: 2.5,
  recovery: 2,
  shadow: 2,
  mirror: 1.5,
  dream: 1.25,
  calm: 1,
  joy: 1,
  focus: 1,
};

export function createSeededRandom(seed: number) {
  let value = seed;

  return function seededRandom() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function recentGlowCount(starId: string, history: GlowHistoryEntry[], currentTick: number, repeatWindowTicks: number) {
  return history.filter((entry) => {
    const insideWindow = currentTick - entry.tick <= repeatWindowTicks;
    return insideWindow && entry.ids.includes(starId);
  }).length;
}

function lastGlowTick(starId: string, history: GlowHistoryEntry[]) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].ids.includes(starId)) return history[i].tick;
  }
  return null;
}

export function chooseGlowingStars<T extends GlowCandidate>(
  stars: T[],
  history: GlowHistoryEntry[],
  options: GlowSchedulerOptions,
  random: () => number,
): string[] {
  const available = stars.filter((s) => s.state !== 'resolved' && s.state !== 'active');
  if (!available.length) return [];

  const scored = available
    .map((s) => {
      const lastTick = lastGlowTick(s.id, history);
      const recentCount = recentGlowCount(s.id, history, options.tick, options.repeatWindowTicks);

      const tooRecent = lastTick !== null && options.tick - lastTick < options.minTicksBetweenGlows;
      const tooRepeated = recentCount >= options.maxRepeatsPerWindow;

      const score =
        1 +
        s.recency * 2 +
        s.intensity * 2 +
        s.unresolvedWeight * 3 +
        EMOTION_SCORE[s.emotion] +
        random();

      return {
        id: s.id,
        score: tooRecent || tooRepeated ? score - 100 : score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, Math.max(1, options.count)).map((s) => s.id);
}
