
'use server';
/**
 * @fileOverview An AI flow to analyze emotions from a facial snapshot.
 *
 * - analyzeFace - A function that handles the analysis of a face image.
 * - AnalyzeFaceInput - The input type for the function.
 * - AnalyzeFaceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeFaceInputSchema,
  AnalyzeFaceOutputSchema,
  type AnalyzeFaceInput,
  type AnalyzeFaceOutput,
} from '@/lib/types';

export async function analyzeFace(input: AnalyzeFaceInput): Promise<AnalyzeFaceOutput | null> {
  return analyzeFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFacePrompt',
  input: {schema: AnalyzeFaceInputSchema},
  output: {schema: AnalyzeFaceOutputSchema},
  prompt: `You are an expert in analyzing human facial expressions. Analyze the following image and identify the dominant emotion.

Image: {{media url=imageDataUri}}

Based on the image, provide the dominant emotion and your confidence in this assessment.`,
});

const analyzeFaceFlow = ai.defineFlow(
  {
    name: 'analyzeFaceFlow',
    inputSchema: AnalyzeFaceInputSchema,
    outputSchema: AnalyzeFaceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output;
  }
);
