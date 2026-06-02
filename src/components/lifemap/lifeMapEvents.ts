import type { EmotionalTone, EmotionEngineInput } from './useEmotionalTone';

export type ChapterId =
  | 'season-of-becoming'
  | 'threshold'
  | 'recovery-arc'
  | 'purple-dream-field'
  | 'mirror-of-becoming';

export type LifeMapPhase = 'living' | 'focus' | 'cluster';

export type MemoryEmotion =
  | 'threshold'
  | 'grief'
  | 'recovery'
  | 'shadow'
  | 'mirror'
  | 'dream'
  | 'calm'
  | 'joy'
  | 'focus';

type NarratorEventPayload = {
  event:
    | 'lifemap.star.glow'
    | 'lifemap.star.focus'
    | 'lifemap.star.resolved'
    | 'lifemap.cluster.focus';
  starId?: string;
  chapterId?: ChapterId | null;
  emotion?: MemoryEmotion | null;
  action?: 'replay' | 'reflect' | 'resolve';
};

type NarratorTonePayload = {
  event: 'narrator.tone.update';
  tone: EmotionalTone;
  voiceStyle: 'soft' | 'clear' | 'urgent' | 'restorative';
  line: string;
  source: 'emotion-engine';
  input?: EmotionEngineInput | null;
};

type TimelineSyncPayload = {
  phase: LifeMapPhase;
  activeStarId?: string | null;
  activeChapterId?: ChapterId | null;
};

export function dispatchNarratorEvent(payload: NarratorEventPayload) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent<NarratorEventPayload>('urai:narrator-event', {
      detail: payload,
    }),
  );
}

export function dispatchNarratorToneEvent(payload: Omit<NarratorTonePayload, 'event' | 'source'>) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent<NarratorTonePayload>('urai:narrator-event', {
      detail: {
        event: 'narrator.tone.update',
        source: 'emotion-engine',
        ...payload,
      },
    }),
  );
}

export function dispatchTimelineSyncEvent(payload: TimelineSyncPayload) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent<TimelineSyncPayload>('urai:timeline-sync', {
      detail: payload,
    }),
  );
}
