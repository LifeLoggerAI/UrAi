'use server';

/**
 * @fileOverview Analyzes text for its sentiment score.
 *
 * - analyzeTextSentiment - A function that handles the analysis of a text string.
 * - AnalyzeTextSentimentInput - The input type for the function.
 * - AnalyzeTextSentimentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Import z for type inference
import {
  AnalyzeTextSentimentInputSchema,
  AnalyzeTextSentimentOutputSchema,
} from '@/lib/types';

// Infer types locally from schemas
type AnalyzeTextSentimentInput = z.infer<typeof AnalyzeTextSentimentInputSchema>;
type AnalyzeTextSentimentOutput = z.infer<typeof AnalyzeTextSentimentOutputSchema>;

export async function analyzeTextSentiment(
  input: AnalyzeTextSentimentInput
): Promise<AnalyzeTextSentimentOutput | null> {
  return analyzeTextSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextSentimentPrompt',
  input: { schema: AnalyzeTextSentimentInputSchema },
  output: { schema: AnalyzeTextSentimentOutputSchema },
  prompt: `You are an expert in sentiment analysis. Analyze the following text entry and provide a sentiment score.\n\nText Entry:\n{{{text}}}\n\nBased on the text, provide the following analysis:\n1.  **Sentiment Score**: Provide an overall sentiment score from -1 (very negative) to 1 (very positive).`,
});

const analyzeTextSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeTextSentimentFlow',
    inputSchema: AnalyzeTextSentimentInputSchema,
    outputSchema: AnalyzeTextSentimentOutputSchema,
  },
  async (input: AnalyzeTextSentimentInput) => {
    const { output } = await prompt(input);
    return output;
  }
);
