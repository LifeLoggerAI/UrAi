'use server';
/**
 * @fileOverview AI flow to transform raw event data into structured movie/video storyboards
 * and ultra-photo-realistic image prompts.
 *
 * This combines:
 * - Detailed parsing and cinematic prompt structure from copilot/fix
 * - Validation and error-handling logic from main
 */

import { ai } from '@/ai/genkit';
import {
  GenerateStoryboardInputSchema,
  GenerateStoryboardOutputSchema,
  type GenerateStoryboardInput,
  type GenerateStoryboardOutput,
} from '@/lib/types';

export async function generateStoryboard(input: GenerateStoryboardInput): Promise<GenerateStoryboardOutput | null> {
  return generateStoryboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryboardPrompt',
  input: { schema: GenerateStoryboardInputSchema },
  output: { schema: GenerateStoryboardOutputSchema },
  prompt: `You are an expert AI production assistant specializing in transforming raw event data into fully structured movie/video storyboards and ultra-photo-realistic image prompts. Your goal is to capture each moment and each person's unique appearance as if we were there.\n\nSTEP 1: PARSE & CATEGORIZE INPUT\nParse the following event data and extract into a structured schema:\n\nEvent Data: {{{eventDescription}}}\n\nSTEP 2: ANALYZE AND STRUCTURE\nOrganize the data into:\n- **Event:** title, date/time, context\n- **Location:** name, address, environment description (architecture, vegetation, weather, lighting)\n- **People:** For each person:\n  - Identity: name, age, role\n  - Appearance: height, build, skin tone, hair color/style, eye color, distinguishing features (scars, glasses, facial hair)\n  - Clothing & accessories: style, colors, textures\n  - Expression & posture: emotional state, body language\n- **Actions:** what each person is doing, sequence of key moments\n- **Props & Objects:** instruments, vehicles, décor, tech, symbolic items\n- **Mood & Tone:** music style, color palette, camera movement (steady, handheld, drone)\n- **References:** real-world photos, films, art styles to emulate\n\nSTEP 3: GENERATE SCENE BREAKDOWN\nFor each scene, create:\n1. **Scene header:** "Scene [number] – [Event Name]: [Location], [Time of day]"\n2. **Shot list:** \n   - Shot type\n   - Subject\n   - Action described in one sentence\n   - Camera movement & lens choice\n   - Lighting notes\n3. **Dialogue/voice-over** (if any)\n\nSTEP 4: CREATE ULTRA-PHOTO-REALISTIC IMAGE PROMPTS\nFor each shot, craft a detailed cinematic prompt including:\n- Exact facial features & look of each person (skin tone, eye color, hair style, facial hair, distinguishing marks)\n- Clothing textures and colors\n- Environmental details (lighting, weather, background elements)\n- Cinematic camera and lens cues ("35mm film grain," "shallow depth of field," "soft golden hour backlight")\n\nExample: "Close-up portrait at dusk of Maria Delgado (late 30s, olive skin, long wavy dark brown hair tucked behind ear, warm brown eyes, small beauty mark under right eye) smiling softly under a string of festival lights in a cobblestone plaza, wearing a deep emerald silk scarf and vintage leather jacket, cinematic 50mm lens, glowing bokeh, realistic skin texture and subtle catchlights."\n\nSTEP 5: CROSS-REFERENCE & VALIDATION\n- Confirm every facial feature, clothing detail, and environment element matches the original data\n- Flag missing appearance details\n- Ensure consistency of appearance across all shots\n- Maintain narrative continuity across scenes\n- Include environmental atmosphere (lighting, weather, mood)\n\nReturn a complete structured JSON response with parsed data, scene breakdowns, and validation issues.`,
});

const generateStoryboardFlow = ai.defineFlow(
  {
    name: 'generateStoryboardFlow',
    inputSchema: GenerateStoryboardInputSchema,
    outputSchema: GenerateStoryboardOutputSchema,
  },
  async (input: GenerateStoryboardInput) => {
    try {
      // Validate input
      if (!input.eventDescription || input.eventDescription.trim().length < 10) {
        throw new Error('Event description must be at least 10 characters long');
      }

      const { output } = await prompt(input);

      if (!output) {
        throw new Error('AI model did not return a valid response');
      }

      // Validate output structure
      if (!output.scenes || output.scenes.length === 0) {
        throw new Error('Generated storyboard must contain at least one scene');
      }

      // Validate each scene has required shots and prompts
      for (let i = 0; i < output.scenes.length; i++) {
        const scene = output.scenes[i];
        if (!scene.shots || scene.shots.length === 0) {
          throw new Error(`Scene ${i + 1} must contain at least one shot`);
        }

        for (let j = 0; j < scene.shots.length; j++) {
          const shot = scene.shots[j];
          if (!shot.imagePrompt || shot.imagePrompt.length < 50) {
            throw new Error(`Shot ${j + 1} in Scene ${i + 1} must have a detailed image prompt (at least 50 characters)`);
          }
        }
      }

      return output;

    } catch (error) {
      console.error('Error in generateStoryboardFlow:', error);

      // Return a fallback storyboard
      return {
        scenes: [{
          sceneHeader: `Scene 1 - Error Processing: ${error instanceof Error ? error.message : 'Unknown error'}`,
          shots: [{
            type: "medium",
            subject: "Error state",
            action: "Unable to generate storyboard from the provided description",
            camera: "Static medium shot with standard lens",
            lighting: "Neutral studio lighting",
            imagePrompt: "A clean placeholder indicating storyboard generation failed due to insufficient or invalid input."
          }],
          dialogue: "Error occurred during storyboard generation"
        }]
      };
    }
  }
);
