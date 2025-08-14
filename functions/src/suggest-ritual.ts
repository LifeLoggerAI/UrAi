// functions/src/suggest-ritual.ts
'use server';

import { genkit as ai } from 'genkit';
import { z } from 'zod';
import {
  SuggestRitualInputSchema,
  SuggestRitualOutputSchema,
} from '@/lib/types';

type SuggestRitualInput = z.infer<typeof SuggestRitualInputSchema>;
type SuggestRitualOutput = z.infer<typeof SuggestRitualOutputSchema>;

export async function suggestRitual(
  input: SuggestRitualInput
): Promise<SuggestRitualOutput | null> {
  return suggestRitualFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRitualPrompt',
  input: { schema: SuggestRitualInputSchema },
  output: { schema: SuggestRitualOutputSchema },
  prompt: `Based on the following user input, suggest a personalized ritual:

User Zone: {{zone}}
User Context: {{context}}

Provide a concise title, a brief description, and a specific suggestion for the ritual.`, // Example prompt
});

const suggestRitualFlow = ai.defineFlow(
  {
    name: 'suggestRitualFlow',
    inputSchema: SuggestRitualInputSchema,
    outputSchema: SuggestRitualOutputSchema,
  },
  async (input: SuggestRitualInput) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Suggest ritual output is null or undefined.');
    }
    return output;
  }
);
