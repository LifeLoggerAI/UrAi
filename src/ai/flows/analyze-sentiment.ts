'use server';

/**
 * @fileOverview A voice event processing AI agent.
 *
 * - processVoiceEvent - A function that handles the full analysis of a voice transcript.
 * - ProcessVoiceEventInput - The input type for the function.
 * - ProcessVoiceEventOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
  ProcessVoiceEventInputSchema,
  ProcessVoiceEventOutputSchema,
  type ProcessVoiceEventInput,
  type ProcessVoiceEventOutput,
} from '@/lib/types';

export async function processVoiceEvent(input: ProcessVoiceEventInput): Promise<ProcessVoiceEventOutput> {
  return processVoiceEventFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processVoiceEventPrompt',
  input: {schema: ProcessVoiceEventInputSchema},
  output: {schema: ProcessVoiceEventOutputSchema},
  prompt: `You are an expert in analyzing human conversation. Analyze the following transcript to extract key information.

Transcript:
{{{transcript}}}

Based on the transcript, provide the following:
1.  A concise one-sentence summary.
2.  A list of relevant tags (e.g., 'work', 'family', 'planning').
3.  A list of all proper names of people mentioned.
4.  Any actionable tasks or to-do items. If none, return an empty array.
5.  The primary emotions conveyed (e.g., 'joy', 'frustration', 'curiosity').
6.  An overall tone score from -1 (very negative) to 1 (very positive).
7.  The social archetype the speaker is embodying (e.g., 'Mentor', 'Friend', 'Reporter', 'Storyteller').
8.  An "emotional echo score" from -100 (highly negative resonance) to 100 (highly positive resonance), representing the lasting emotional impact of the conversation.`,
});

const processVoiceEventFlow = ai.defineFlow(
  {
    name: 'processVoiceEventFlow',
    inputSchema: ProcessVoiceEventInputSchema,
    outputSchema: ProcessVoiceEventOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
