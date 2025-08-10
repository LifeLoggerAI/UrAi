// src/ai/flows/transcribe-audio.ts
'use server';
import 'server-only';

/**
 * @fileOverview An audio transcription AI agent.
 *
 * - transcribeAudio - A function that handles the audio transcription process.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import { getAI } from '@/ai/genkit.server';
import {
  TranscribeAudioInputSchema,
  TranscribeAudioOutputSchema,
  type TranscribeAudioInput,
  type TranscribeAudioOutput,
} from '@/lib/types';

// Initialize Genkit instance lazily on the server
const ai = getAI();

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
      // Keeping your original shape; if your Genkit version expects `input:` instead of `prompt:`,
      // change `prompt` → `input`.
      prompt: [{ media: { url: input.audioDataUri } }],
    });

    return { transcript: text };
  }
);
