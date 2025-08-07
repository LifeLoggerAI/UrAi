'use server';
/**
 * @fileOverview A text-to-speech generation flow with SSML support.
 *
 * - generateSpeech - A function that converts text into speech audio with optional SSML markup.
 * - GenerateSpeechInput - The input type for the function.
 * - GenerateSpeechOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';
import { 
    GenerateSpeechInputSchema, 
    GenerateSpeechOutputSchema,
    type GenerateSpeechInput,
    type GenerateSpeechOutput
} from '@/lib/types';
import { wrapTextWithSSML, isNeuralVoice, NEURAL_VOICES } from '@/lib/ssml-utils';

export async function generateSpeech(
  input: GenerateSpeechInput
): Promise<GenerateSpeechOutput | null> {
  return generateSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
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
  async (input) => {
    // Prepare the text input for TTS
    let textInput = input.text;
    let voiceName = input.voiceName || 'Algenib';

    // If SSML is enabled, wrap the text with SSML markup
    if (input.useSSML) {
      // Use a neural voice if one isn't specified
      if (!input.voiceName) {
        voiceName = NEURAL_VOICES.google[3]; // Default to en-US-Wavenet-D
      }

      textInput = wrapTextWithSSML(input.text, {
        voiceName,
        rate: input.rate,
        pitch: input.pitch,
        enableEmphasis: input.enableEmphasis,
        addNaturalPauses: input.addNaturalPauses
      });
    }

    // Determine if we should use SSML-compatible configuration
    const useSSMLConfig = input.useSSML || isNeuralVoice(voiceName);

    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: voiceName},
          },
        },
      },
      prompt: textInput,
    });

    if (!media) {
      throw new Error('No media was returned from the TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
