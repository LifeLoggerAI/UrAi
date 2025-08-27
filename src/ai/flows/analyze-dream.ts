'use server';
/**
 * @fileOverview Defines the AI flow for analyzing dream content.
 *
 * This file creates a Genkit flow that takes a user's dream description
 * and uses an AI model to extract symbolic meanings, emotions, and themes.
 */

import { ai } from '@/ai/genkit';
import {
  AnalyzeDreamInputSchema,
  AnalyzeDreamOutputSchema,
  type AnalyzeDreamInput,
  type AnalyzeDreamOutput,
} from '@/lib/types';

const dreamAnalysisPrompt = ai.definePrompt({
  name: 'dreamAnalysisPrompt',
  input: { schema: AnalyzeDreamInputSchema },
  output: { schema: AnalyzeDreamOutputSchema },

  // Define the persona and instructions for the AI model.
  prompt: `You are an expert dream analyst with a deep understanding of symbolism, psychology, and mythology. Your task is to analyze the user's dream narrative.

Analyze the following dream:
"{{{text}}}"

Based on the text, provide the following analysis:
1.  **Emotions**: Identify the primary emotions present in the dream.
2.  **Themes**: Determine the major themes or subjects.
3.  **Symbols**: List key symbols and provide a brief interpretation for each.
4.  **Sentiment Score**: Assign an overall sentiment score from -1 (very negative) to 1 (very positive).
`,
});

const analyzeDreamFlow = ai.defineFlow(
  {
    name: 'analyzeDreamFlow',
    inputSchema: AnalyzeDreamInputSchema,
    outputSchema: AnalyzeDreamOutputSchema,
  },
  async (input: AnalyzeDreamInput): Promise<AnalyzeDreamOutput> => {
    const { output } = await dreamAnalysisPrompt(input);
    if (!output) {
      throw new Error('Dream analysis failed to produce a response.');
    }
    return output;
  }
);

// The exported function that the application will call.
export async function analyzeDream(
  input: AnalyzeDreamInput
): Promise<AnalyzeDreamOutput> {
  return analyzeDreamFlow(input);
}

export default analyzeDream;
