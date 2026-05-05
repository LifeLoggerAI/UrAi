import type { ChapterId, MemoryEmotion } from './lifeMapEvents';

export type RawMemorySignal = {
  title?: unknown;
  summary?: unknown;
  transcript?: unknown;
  text?: unknown;
  emotion?: unknown;
  primaryEmotion?: unknown;
  mood?: unknown;
  chapterId?: unknown;
  chapter?: unknown;
  arc?: unknown;
  intensity?: unknown;
  emotionalIntensity?: unknown;
  weight?: unknown;
  recency?: unknown;
  recencyScore?: unknown;
  unresolvedWeight?: unknown;
  openLoopScore?: unknown;
  shadowWeight?: unknown;
  resolved?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type MemoryIntelligence = {
  title: string;
  text: string;
  emotion: MemoryEmotion;
  chapterId: ChapterId;
  intensity: number;
  recency: number;
  unresolvedWeight: number;
  narratorLine: string;
};

const EMOTION_KEYWORDS: Array<[MemoryEmotion, string[]]> = [
  ['threshold', ['change', 'shift', 'decision', 'left', 'quit', 'started', 'ended', 'threshold', 'breakthrough']],
  ['grief', ['loss', 'miss', 'gone', 'grief', 'sad', 'cry', 'funeral', 'lonely', 'goodbye']],
  ['recovery', ['better', 'healed', 'recover', 'rest', 'breathe', 'calm down', 'returned', 'softened']],
  ['shadow', ['argument', 'fight', 'anger', 'ashamed', 'shame', 'fear', 'avoid', 'triggered', 'stressed']],
  ['mirror', ['realized', 'identity', 'becoming', 'pattern', 'mirror', 'truth', 'noticed', 'understood']],
  ['dream', ['dream', 'symbol', 'night', 'sleep', 'strange', 'image', 'vision']],
  ['joy', ['happy', 'joy', 'laughed', 'celebrated', 'excited', 'proud', 'grateful']],
  ['focus', ['work', 'built', 'created', 'focused', 'flow', 'productive', 'clear']],
  ['calm', ['peace', 'stable', 'quiet', 'calm', 'safe', 'still']],
];

const CHAPTER_KEYWORDS: Array<[ChapterId, string[]]> = [
  ['threshold', ['change', 'decision', 'shift', 'ended', 'started', 'left', 'threshold', 'breakthrough']],
  ['recovery-arc', ['recover', 'healed', 'rest', 'better', 'softened', 'returned', 'repair']],
  ['purple-dream-field', ['dream', 'symbol', 'night', 'sleep', 'vision', 'image']],
  ['mirror-of-becoming', ['identity', 'becoming', 'mirror', 'truth', 'realized', 'pattern', 'understood']],
  ['season-of-becoming', ['growth', 'learned', 'practice', 'habit', 'started', 'created', 'built']],
];

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function clamp01(value: unknown, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(1, value));
}

function scoreKeywords(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.reduce((score, keyword) => (lower.includes(keyword) ? score + 1 : score), 0);
}

function pickByKeywords<T extends string>(text: string, entries: Array<[T, string[]]>, fallback: T): T {
  let best = fallback;
  let bestScore = 0;

  entries.forEach(([value, keywords]) => {
    const score = scoreKeywords(text, keywords);
    if (score > bestScore) {
      best = value;
      bestScore = score;
    }
  });

  return best;
}

function inferRecency(createdAt: unknown, updatedAt: unknown) {
  const raw = typeof updatedAt === 'number' ? updatedAt : typeof createdAt === 'number' ? createdAt : null;
  if (!raw) return 0.55;
  const ageDays = Math.max(0, (Date.now() - raw) / 86400000);
  return Math.max(0.15, Math.min(1, 1 - ageDays / 45));
}

function inferIntensity(text: string, explicit: unknown) {
  const explicitScore = clamp01(explicit, -1);
  if (explicitScore >= 0) return explicitScore;

  const lower = text.toLowerCase();
  let score = 0.42;
  if (/[!]{1,}/.test(text)) score += 0.12;
  if (['very', 'really', 'always', 'never', 'huge', 'major', 'intense'].some((word) => lower.includes(word))) score += 0.14;
  if (['panic', 'fight', 'loss', 'breakthrough', 'grief', 'ashamed'].some((word) => lower.includes(word))) score += 0.22;
  if (text.length > 180) score += 0.08;
  return Math.max(0.15, Math.min(1, score));
}

function inferUnresolvedWeight(text: string, explicit: unknown, resolved: unknown) {
  if (resolved === true) return 0.05;
  const explicitScore = clamp01(explicit, -1);
  if (explicitScore >= 0) return explicitScore;

  const lower = text.toLowerCase();
  let score = 0.28;
  if (['why', 'still', 'again', 'stuck', 'unresolved', 'confused', 'avoid', 'loop'].some((word) => lower.includes(word))) score += 0.28;
  if (['argument', 'shame', 'fear', 'loss', 'miss', 'angry'].some((word) => lower.includes(word))) score += 0.22;
  if (['resolved', 'forgave', 'finished', 'closed', 'accepted'].some((word) => lower.includes(word))) score -= 0.2;
  return Math.max(0.05, Math.min(1, score));
}

function buildNarratorLine(memory: Omit<MemoryIntelligence, 'narratorLine'>) {
  if (memory.unresolvedWeight >= 0.72) {
    return `This ${memory.emotion} memory keeps resurfacing because the pattern is not fully resolved yet.`;
  }

  if (memory.chapterId === 'threshold') {
    return `This moment marks a threshold in your story, where an old rhythm began to shift.`;
  }

  if (memory.chapterId === 'recovery-arc') {
    return `This memory belongs to a recovery arc. It shows where pressure began turning into return.`;
  }

  if (memory.chapterId === 'mirror-of-becoming') {
    return `This memory reflects a larger pattern of who you are becoming.`;
  }

  if (memory.chapterId === 'purple-dream-field') {
    return `This memory is symbolic. Let the image repeat before you explain it.`;
  }

  return `This ${memory.emotion} memory is part of your ${memory.chapterId} arc.`;
}

export function enrichMemorySignal(raw: RawMemorySignal, index: number): MemoryIntelligence {
  const title = asText(raw.title) || asText(raw.summary) || `Memory ${index + 1}`;
  const text = [asText(raw.title), asText(raw.summary), asText(raw.transcript), asText(raw.text)].filter(Boolean).join(' ');
  const explicitEmotion = asText(raw.emotion) || asText(raw.primaryEmotion) || asText(raw.mood);
  const explicitChapter = asText(raw.chapterId) || asText(raw.chapter) || asText(raw.arc);

  const inferredEmotion = pickByKeywords<MemoryEmotion>(text || title, EMOTION_KEYWORDS, 'mirror');
  const inferredChapter = pickByKeywords<ChapterId>(text || title, CHAPTER_KEYWORDS, 'season-of-becoming');

  const emotion = (EMOTION_KEYWORDS.some(([candidate]) => candidate === explicitEmotion) ? explicitEmotion : inferredEmotion) as MemoryEmotion;
  const chapterId = (CHAPTER_KEYWORDS.some(([candidate]) => candidate === explicitChapter) ? explicitChapter : inferredChapter) as ChapterId;
  const intensity = inferIntensity(text || title, raw.intensity ?? raw.emotionalIntensity ?? raw.weight);
  const recency = clamp01(raw.recency ?? raw.recencyScore, inferRecency(raw.createdAt, raw.updatedAt));
  const unresolvedWeight = inferUnresolvedWeight(text || title, raw.unresolvedWeight ?? raw.openLoopScore ?? raw.shadowWeight, raw.resolved);

  const memory = {
    title,
    text,
    emotion,
    chapterId,
    intensity,
    recency,
    unresolvedWeight,
  };

  return {
    ...memory,
    narratorLine: buildNarratorLine(memory),
  };
}
