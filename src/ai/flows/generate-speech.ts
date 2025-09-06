'use server';
/**
 * @fileOverview Text-to-Speech (TTS) generation flow using Genkit.
 *
 * This file defines a Genkit flow that converts a string of text into
 * playable audio data.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateSpeechInputSchema,
  GenerateSpeechOutputSchema,
  type GenerateSpeechInput,
  type GenerateSpeechOutput,
} from '@/lib/types';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

/**
 * Converts raw PCM audio data into a Base64-encoded WAV format.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d: Uint8Array | string) => {
      bufs.push(Buffer.isBuffer(d) ? d : Buffer.from(d));
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async (input: GenerateSpeechInput): Promise<GenerateSpeechOutput> => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });
    if (!media) {
      throw new Error('no media returned from TTS model');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);
    return {
      audioDataUri: 'data:audio/wav;base64,' + wavData,
    };
  }
);

export async function generateSpeech(
  input: GenerateSpeechInput
): Promise<GenerateSpeechOutput> {
  return generateSpeechFlow(input);
}

export default generateSpeech;
