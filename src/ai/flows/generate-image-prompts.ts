'use server';

/**
 * @fileOverview Generates ultra-photo-realistic image prompts for each shot.
 *
 * - generateImagePrompts - A function that creates detailed image prompts for video/image generation.
 * - GenerateImagePromptsInput - The input type for the function.
 * - GenerateImagePromptsOutput - The return type for the function.
 */

import {ai} from '../genkit';
import {
  GenerateImagePromptsInputSchema,
  GenerateImagePromptsOutputSchema,
  type GenerateImagePromptsInput,
  type GenerateImagePromptsOutput,
} from '../../lib/types';

export async function generateImagePrompts(input: GenerateImagePromptsInput): Promise<GenerateImagePromptsOutput | null> {
  return generateImagePromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImagePromptsPrompt',
  input: {schema: GenerateImagePromptsInputSchema},
  output: {schema: GenerateImagePromptsOutputSchema},
  prompt: `You are an expert AI image prompt engineer specializing in ultra-photo-realistic imagery. Create detailed text prompts for each shot that will generate lifelike images.

Original Event Data:
{{{eventData}}}

Scene Breakdown:
{{{sceneBreakdown}}}

For each shot, craft a detailed image prompt that includes:

**Exact Facial Features & Look:**
- Precise skin tone descriptions (warm olive, pale porcelain, rich ebony, etc.)
- Specific eye color and shape
- Detailed hair style, color, and texture
- Facial hair descriptions if applicable
- Any distinguishing marks (beauty marks, scars, glasses, etc.)
- Age-appropriate facial features

**Clothing & Textures:**
- Specific fabric textures (silk, leather, cotton, wool, etc.)
- Exact colors and patterns
- Fit and style details
- Accessories and jewelry

**Environmental Details:**
- Specific lighting conditions (golden hour, overcast soft light, warm interior lighting, etc.)
- Background elements and their textures
- Weather conditions and atmosphere
- Architectural or natural details

**Cinematic Camera Cues:**
- Film format references ("35mm film grain", "medium format clarity")
- Depth of field ("shallow depth of field", "everything in sharp focus")
- Lighting style ("soft golden hour backlight", "dramatic side lighting", "even studio lighting")
- Camera angle and perspective
- Photographic quality indicators ("realistic skin texture", "subtle catchlights", "natural color grading")

**Example Format:**
"Close-up portrait at dusk of Maria Delgado (late 30s, olive skin, long wavy dark brown hair tucked behind ear, warm brown eyes, small beauty mark under right eye) smiling softly under a string of festival lights in a cobblestone plaza, wearing a deep emerald silk scarf and vintage leather jacket, cinematic 50mm lens, glowing bokeh, realistic skin texture and subtle catchlights."

Make each prompt vivid, specific, and cinematic while maintaining consistency with the original event data.`,
});

const generateImagePromptsFlow = ai.defineFlow(
  {
    name: 'generateImagePromptsFlow',
    inputSchema: GenerateImagePromptsInputSchema,
    outputSchema: GenerateImagePromptsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output;
  }
);