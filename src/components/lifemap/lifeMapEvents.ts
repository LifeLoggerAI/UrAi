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

export function dispatchTimelineSyncEvent(payload: TimelineSyncPayload) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent<TimelineSyncPayload>('urai:timeline-sync', {
      detail: payload,
    }),
  );
}
