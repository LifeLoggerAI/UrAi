// functions/src/generate-symbolic-insight.ts
'use server';

import { genkit as ai } from 'genkit';
import { z } from 'zod';
import {
  GenerateSymbolicInsightInputSchema,
  GenerateSymbolicInsightOutputSchema,
} from '@/lib/types';

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
  prompt: `Based on the following camera image analysis, generate a symbolic insight:

Analysis: {{analysis}}

Provide a concise narrator reflection and a symbolic animation trigger.`, // Example prompt
});

const generateSymbolicInsightFlow = ai.defineFlow(
  {
    name: 'generateSymbolicInsightFlow',
    inputSchema: GenerateSymbolicInsightInputSchema,
    outputSchema: GenerateSymbolicInsightOutputSchema,
  },
  async (input: GenerateSymbolicInsightInput) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Symbolic insight generation output is null or undefined.');
    }
    return output;
  }
);
