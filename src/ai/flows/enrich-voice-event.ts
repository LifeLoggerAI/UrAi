'use server';

/**
 * @fileOverview Enriches a voice event transcript with AI analysis.
 *
 * - enrichVoiceEvent - A function that handles the full analysis of a voice transcript.
 * - EnrichVoiceEventInput - The input type for the function.
 * - EnrichVoiceEventOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Import z for type inference
import {
  EnrichVoiceEventInputSchema,
  EnrichVoiceEventOutputSchema,
} from '@/lib/types';

// Infer types locally from schemas
type EnrichVoiceEventInput = z.infer<typeof EnrichVoiceEventInputSchema>;
type EnrichVoiceEventOutput = z.infer<typeof EnrichVoiceEventOutputSchema>;

export async function enrichVoiceEvent(
  input: EnrichVoiceEventInput
): Promise<EnrichVoiceEventOutput | null> {
  return enrichVoiceEventFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enrichVoiceEventPrompt',
  input: { schema: EnrichVoiceEventInputSchema },
  output: { schema: EnrichVoiceEventOutputSchema },
  prompt: `You are an expert in analyzing human conversation. Analyze the following transcript to extract key information.\n\nTranscript:\n{{{text}}}\n\nBased on the transcript, provide the following:\n1.  The primary emotion conveyed (e.g., 'joy', 'frustration', 'curiosity').\n2.  An sentiment score from -1 (very negative) to 1 (very positive).\n3.  A tone shift score from 0 (stable) to 1 (highly volatile).\n4.  The social archetype the speaker is embodying (e.g., 'Mentor', 'Friend', 'Reporter', 'Storyteller').\n5.  A list of any proper nouns that are names of people mentioned.\n6.  A list of any actionable tasks or to-do items mentioned. If no tasks are found, return an empty array.`,
});

const enrichVoiceEventFlow = ai.defineFlow(
  {
    name: 'enrichVoiceEventFlow',
    inputSchema: EnrichVoiceEventInputSchema,
    outputSchema: EnrichVoiceEventOutputSchema,
  },
  async (input: EnrichVoiceEventInput) => {
    const { output } = await prompt(input);
    return output;
  }
);
