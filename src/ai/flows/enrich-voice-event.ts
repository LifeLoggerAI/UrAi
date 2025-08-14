export type EnrichVoiceEventInput = { transcript?: string; emotionHint?: string; tags?: string[]; text?: string };
export type EnrichVoiceEventOutput = { tags: string[]; sentiment: string; entities: string[]; input: EnrichVoiceEventInput };

export async function enrichVoiceEvent(input: EnrichVoiceEventInput): Promise<EnrichVoiceEventOutput | null> {
  const t = (input?.transcript || input?.text || "").toLowerCase();
  const tags: string[] = [];
  if (/\b(work|deadline|meeting|boss)\b/.test(t)) tags.push("work");
  if (/\b(relationship|friend|family|mom|dad|partner)\b/.test(t)) tags.push("relationship");
  if (/\b(health|sleep|exercise|gym|doctor)\b/.test(t)) tags.push("health");
  const sentiment = /(\b(great|good|happy|excited)\b)/.test(t) ? "positive"
                    : /(\b(bad|sad|angry|tired)\b)/.test(t) ? "negative" : "neutral";
  return { tags, sentiment, entities: [], input };
}
export default enrichVoiceEvent;
