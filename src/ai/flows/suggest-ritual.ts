export type SuggestRitualInput = { context?: string; mood?: string };
export type SuggestRitualOutput = { suggestion: string; category: string };
export async function suggestRitual(input: SuggestRitualInput): Promise<SuggestRitualOutput | null> {
  return { suggestion: 'Take a 3-minute breath break', category: input?.mood ?? 'calm' };
}
export default suggestRitual;
