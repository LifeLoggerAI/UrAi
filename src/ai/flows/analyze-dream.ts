/**
 * Temporary stub for analyze-dream to satisfy imports during build.
 * Replace with your real Genkit/Gemini prompt flow later.
 */
export type AnalyzeDreamInput = {
  text: string;
};

export type AnalyzeDreamOutput = {
  emotions: string[];
  symbols: string[];
  themes: string[];
  summary: string;
};

export async function analyzeDream(input: AnalyzeDreamInput): Promise<AnalyzeDreamOutput> {
  const text = input?.text ?? '';
  // naive placeholders
  return {
    emotions: [],
    symbols: [],
    themes: [],
    summary: text.slice(0, 180),
  };
}

export default analyzeDream;
