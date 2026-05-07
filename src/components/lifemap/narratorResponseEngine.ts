import type { EmotionalTone, EmotionEngineInput } from './useEmotionalTone';
import type { ChapterId, MemoryEmotion } from './lifeMapEvents';

export type NarratorVoiceStyle = 'soft' | 'clear' | 'urgent' | 'restorative';

export type NarratorResponseContext = {
  tone: EmotionalTone;
  event?:
    | 'narrator.tone.update'
    | 'lifemap.star.glow'
    | 'lifemap.star.focus'
    | 'lifemap.star.resolved'
    | 'lifemap.cluster.focus';
  chapterId?: ChapterId | null;
  emotion?: MemoryEmotion | null;
  action?: 'replay' | 'reflect' | 'resolve' | null;
  input?: EmotionEngineInput | null;
};

export type NarratorResponse = {
  voiceStyle: NarratorVoiceStyle;
  line: string;
  pace: 'slow' | 'steady' | 'quick';
  intensity: 'low' | 'medium' | 'high';
};

const TONE_RESPONSE: Record<EmotionalTone, NarratorResponse> = {
  calm: {
    voiceStyle: 'soft',
    line: 'A quiet pattern is becoming visible.',
    pace: 'slow',
    intensity: 'low',
  },
  focused: {
    voiceStyle: 'clear',
    line: 'Stay with this thread. It is organizing into a pattern.',
    pace: 'steady',
    intensity: 'medium',
  },
  charged: {
    voiceStyle: 'urgent',
    line: 'Something is active. Let us slow it down enough to see it clearly.',
    pace: 'quick',
    intensity: 'high',
  },
  restorative: {
    voiceStyle: 'restorative',
    line: 'You are returning to yourself. Let this open gently.',
    pace: 'slow',
    intensity: 'low',
  },
};

const CHAPTER_LINES: Partial<Record<ChapterId, string>> = {
  'season-of-becoming': 'This chapter is showing where growth began before it had a name.',
  threshold: 'This threshold deserves attention. It marks a shift in the old rhythm.',
  'recovery-arc': 'This recovery arc is evidence that your system can soften and return.',
  'purple-dream-field': 'The dream field is speaking symbolically. Look for what repeats.',
  'mirror-of-becoming': 'The mirror is gathering the larger pattern of who you are becoming.',
};

const EMOTION_LINES: Partial<Record<MemoryEmotion, string>> = {
  threshold: 'A threshold signal is active here.',
  grief: 'There is grief in this thread. Move slowly with it.',
  recovery: 'This looks like a recovery signal, not just an ending.',
  shadow: 'A shadow pattern is surfacing. It needs clarity, not judgment.',
  mirror: 'This moment reflects something larger about your identity.',
  dream: 'This memory is symbolic. Let the image speak before explaining it.',
  calm: 'This is a calm anchor in the map.',
  joy: 'There is life returning in this signal.',
  focus: 'This signal wants your attention without rushing you.',
};

export function buildNarratorResponse(context: NarratorResponseContext): NarratorResponse {
  const base = TONE_RESPONSE[context.tone];

  if (context.action === 'resolve') {
    return {
      ...base,
      voiceStyle: context.tone === 'charged' ? 'clear' : base.voiceStyle,
      line: 'This one has softened. Let the map make room for what comes next.',
      pace: 'slow',
      intensity: 'low',
    };
  }

  if (context.action === 'replay') {
    return {
      ...base,
      line: 'Replaying the thread. Notice what changes when you see it from here.',
      pace: context.tone === 'charged' ? 'steady' : base.pace,
    };
  }

  if (context.action === 'reflect') {
    return {
      ...base,
      line: 'Reflection mode is open. Name the pattern before you name the conclusion.',
      pace: 'steady',
    };
  }

  if (context.event === 'lifemap.cluster.focus' && context.chapterId) {
    return {
      ...base,
      line: CHAPTER_LINES[context.chapterId] ?? base.line,
    };
  }

  if ((context.event === 'lifemap.star.focus' || context.event === 'lifemap.star.glow') && context.emotion) {
    return {
      ...base,
      line: EMOTION_LINES[context.emotion] ?? base.line,
    };
  }

  return base;
}
