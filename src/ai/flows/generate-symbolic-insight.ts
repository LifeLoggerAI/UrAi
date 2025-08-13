'use server';
/**
 * @fileOverview Generates a symbolic insight from a camera image analysis.
 *
 * - generateSymbolicInsight - A function that creates a reflection from image analysis.
 * - GenerateSymbolicInsightInput - The input type for the function.
 * - GenerateSymbolicInsightOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Import z for type inference
import {
  GenerateSymbolicInsightInputSchema,
  GenerateSymbolicInsightOutputSchema,
} from '@/lib/types';

// Infer types locally from schemas
type GenerateSymbolicInsightInput = z.infer<typeof GenerateSymbolicInsightInputSchema>;
type GenerateSymbolicInsightOutput = z.infer<typeof GenerateSymbolicInsightOutputSchema>;

export async function generateSymbolicInsight(
  input: GenerateSymbolicInsightInput
): Promise<GenerateSymbolicInsightOutput | null> {
  return generateSymbolicInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSymbolicInsightPrompt',
  input: { schema: GenerateSymbolicInsightInputSchema },
  output: { schema: GenerateSymbolicInsightOutputSchema },
  prompt: `You are an AI companion that generates symbolic insights. Based on the analysis of an image from a user's life, generate a narrator reflection and determine if a visual effect should be triggered.\n\nImage Analysis:\n{{{json analysis}}}\n\n1.  **narratorReflection**: Write a short, insightful, and empathetic reflection for the user based on the analysis.\n2.  **symbolAnimationTrigger**: Based on the analysis, suggest a symbolic animation trigger. Possible values are "aura_shift", "fog", "memory_bloom", or "none".`,
});

const generateSymbolicInsightFlow = ai.defineFlow(
  {
    name: 'generateSymbolicInsightFlow',
    inputSchema: GenerateSymbolicInsightInputSchema,
    outputSchema: GenerateSymbolicInsightOutputSchema,
  },
  async (input: GenerateSymbolicInsightInput) => {
    const { output } = await prompt(input);
    return output;
  }
);
