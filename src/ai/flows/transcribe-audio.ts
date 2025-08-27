'use server';
/**
 * @fileOverview Audio transcription flow using Genkit.
 *
 * This file defines a Genkit flow that takes an audio file as a data URI
 * and returns the transcribed text.
 */

import { ai } from '@/ai/genkit';
import {
  TranscribeAudioInputSchema,
  TranscribeAudioOutputSchema,
  type TranscribeAudioInput,
  type TranscribeAudioOutput,
} from '@/lib/types';

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input: TranscribeAudioInput): Promise<TranscribeAudioOutput> => {
    // Call the Gemini model with a prompt containing both text and the audio media.
    const { text } = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: [
        {
          text: 'Transcribe the following audio recording. Provide only the transcribed text as a string.',
        },
        { media: { url: input.audioDataUri } },
      ],
    });

    return { transcript: text };
  }
);

export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

export default transcribeAudio;
