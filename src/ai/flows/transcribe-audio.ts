'use server';

/**
 * @fileOverview An audio transcription AI agent.
 *
 * - transcribeAudio - A function that handles the audio transcription process.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import { ai } from '@/ai/genkit';
import {
  TranscribeAudioInputSchema,
  TranscribeAudioOutputSchema,
  type TranscribeAudioInput,
  type TranscribeAudioOutput,
} from '@/lib/types';

export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    // If gemini-2.0-flash is not in your quota, switch to 1.5-flash
    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [{ media: { url: input.audioDataUri } }],
    });

    return { transcript: text };
  }
);
