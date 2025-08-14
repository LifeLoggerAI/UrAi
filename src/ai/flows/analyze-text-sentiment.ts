/**
 * Temporary stub for analyze-text-sentiment to satisfy imports during build.
 * Replace with your real Genkit/Gemini flow later.
 */
export type AnalyzeTextSentimentInput = { text: string };
export type AnalyzeTextSentimentOutput = {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1..1
};

export async function analyzeTextSentiment(
  input: AnalyzeTextSentimentInput
): Promise<AnalyzeTextSentimentOutput | null> {
  const t = (input?.text ?? '').toLowerCase();
  let score = 0;
  if (t.match(/\b(love|great|amazing|happy|good)\b/)) score = 0.7;
  if (t.match(/\b(hate|bad|awful|sad|angry)\b/)) score = -0.6;

  const sentiment = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral';
  return { sentiment, score };
}

export default analyzeTextSentiment;
