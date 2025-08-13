'use server';
/**
 * @fileOverview Suggests a personalized ritual or journaling prompt.
 *
 * - suggestRitual - A function that suggests a ritual based on user interaction.
 * - SuggestRitualInput - The input type for the function.
 * - SuggestRitualOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Import z for type inference
import {
  SuggestRitualInputSchema,
  SuggestRitualOutputSchema,
} from '@/lib/types';

// Infer types locally from schemas
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
  prompt: `You are a wise and empathetic AI companion in a journaling app. A user has interacted with a symbolic representation of themselves. Based on the area they touched and their current context, suggest a small, actionable ritual or a journaling prompt.\n\nKeep the tone gentle, inviting, and encouraging. The goal is to foster mindfulness and self-reflection and understanding. Keep your responses concise and thoughtful.\n\nInteraction Zone: {{{zone}}}\nUser Context: {{{context}}}\n\nBased on this, generate a title, a short description, and a specific suggestion.\n\nFor the 'head' zone (thoughts, dreams), suggest something related to clarifying thoughts or exploring symbols.\nFor the 'torso' zone (emotions, memories), suggest something related to processing a feeling or revisiting a memory kindly.\nFor the 'limbs' zone (actions, social), suggest a small action related to the body or social connection.\nFor the 'aura' zone (overall mood), suggest a general mindfulness or gratitude exercise.`,
});

const suggestRitualFlow = ai.defineFlow(
  {
    name: 'suggestRitualFlow',
    inputSchema: SuggestRitualInputSchema,
    outputSchema: SuggestRitualOutputSchema,
  },
  async (input: SuggestRitualInput) => {
    const { output } = await prompt(input);
    return output;
  }
);
