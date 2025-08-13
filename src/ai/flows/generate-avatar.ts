'use server';
/**
 * @fileOverview A flow to generate an avatar image for a person.
 *
 * - generateAvatar - A function that generates an avatar image based on a name and role.
 * - GenerateAvatarInput - The input type for the function.
 * - GenerateAvatarOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Import z for type inference
import {
  GenerateAvatarInputSchema,
  GenerateAvatarOutputSchema,
} from '@/lib/types';

// Infer types locally from schemas
type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;
type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(
  input: GenerateAvatarInput
): Promise<GenerateAvatarOutput | null> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async (input: GenerateAvatarInput) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an abstract, artistic, and visually pleasing avatar for a person named '${input.name}' who is perceived as a '${input.role}'. The avatar should be symbolic, not a photorealistic portrait. Use a consistent, soft color palette. The style should be minimalist and modern, suitable for a circular profile picture.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      console.error('Image generation failed to return a media URL.');
      return null;
    }

    return {
      avatarDataUri: media.url,
    };
  }
);
