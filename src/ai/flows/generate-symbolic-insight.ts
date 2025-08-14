export type GenerateSymbolicInsightInput = { text?: string };
export type GenerateSymbolicInsightOutput = { insight: string; symbols: string[] };
export async function generateSymbolicInsight(
  input: GenerateSymbolicInsightInput
): Promise<GenerateSymbolicInsightOutput | null> {
  const txt = input?.text ?? '';
  return { insight: txt ? 'Stub insight' : 'No input', symbols: [] };
}
export default generateSymbolicInsight;
