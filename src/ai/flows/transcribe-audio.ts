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

export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

// In a real implementation, this flow would call a speech-to-text model
// like Whisper via a Genkit extension. For now, it returns a hardcoded
// transcript for demonstration purposes to allow UI development.
const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    // MOCK TRANSCRIPTION
    const transcript = "I had a meeting with Alex about the Q3 projections, it went pretty well. I need to remember to send the follow-up notes by the end of the day. We also briefly discussed the upcoming team offsite, and Maria seemed excited about the new venue.";
    
    return { transcript };
  }
);
