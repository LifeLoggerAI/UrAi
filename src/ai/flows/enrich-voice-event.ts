/**
 * Temporary stub for enrich-voice-event to satisfy imports during build.
 * Replace with your real AI enrichment later.
 */
export type EnrichVoiceEventInput = {
  transcript?: string;
  emotionHint?: string;
};

export type EnrichVoiceEventOutput = {
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  entities: Array<{ type: string; text: string }>;
};

export async function enrichVoiceEvent(
  input: EnrichVoiceEventInput
): Promise<EnrichVoiceEventOutput | null> {
  const t: string = (input?.transcript ?? '').toLowerCase();

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (/\b(love|great|amazing|grateful|happy|good)\b/.test(t)) sentiment = 'positive';
  if (/(hate|bad|awful|angry|sad|anxious)\b/.test(t)) sentiment = 'negative';

  const tags: string[] = [];
  if (/(work|deadline|meeting|boss)\b/.test(t)) tags.push('work');
  if (/(relationship|friend|family|mom|dad|partner)\b/.test(t)) tags.push('relationship');
  if (/(health|sleep|exercise|gym|doctor)\b/.test(t)) tags.push('health');

  const entities: Array<{ type: string; text: string }> = [];

  return {
    tags,
    sentiment,
    entities,
  };
}

export default enrichVoiceEvent;
