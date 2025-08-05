'use server';
/**
 * @fileOverview An audio transcription AI agent.
 *
 * - transcribeAudio - A function that handles the audio transcription process.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import {ai} from '@/ai/genkit';
import {
  TranscribeAudioInputSchema,
  TranscribeAudioOutputSchema,
  type TranscribeAudioInput,
  type TranscribeAudioOutput,
} from '@/lib/types';
import { googleAI } from '@genkit-ai/googleai';
import { MemoryService } from '@/lib/memory-service';

export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
        model: googleAI.model('gemini-1.5-flash'),
        prompt: [{ media: { url: input.audioDataUri } }],
    });
    
    // Extract userId from input or use a default
    const userId = (input as any).userId || 'default-user';
    
    // Save transcript to memory for future cross-referencing
    const transcriptMemory = {
      transcript: text,
      timestamp: Date.now(),
      audioLength: input.audioDataUri.length, // rough proxy for audio length
      source: 'transcribe-audio'
    };

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    await MemoryService.saveMemory(
      userId,
      `transcript-${today}`,
      transcriptMemory,
      'transcribe-audio'
    );

    return { transcript: text };
  }
);
