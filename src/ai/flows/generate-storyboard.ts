'use server';
/**
 * @fileOverview AI flow for generating movie/video storyboards from event data.
 *
 * This flow transforms raw event descriptions into structured movie storyboards
 * with photo-realistic image prompts for each shot.
 * 
 * - generateStoryboard - Main function to generate storyboard from event description
 * - GenerateStoryboardInput - Input type for the function
 * - GenerateStoryboardOutput - Output type for the function
 */

import {ai} from '@/ai/genkit';
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
  input: {schema: GenerateStoryboardInputSchema},
  output: {schema: GenerateStoryboardOutputSchema},
  prompt: `You are an AI production assistant specialized in transforming raw event data into fully structured movie/video storyboards and photo-realistic image prompts.

**Input Event Description:**
{{{eventDescription}}}

**Your Task:** Transform this into a complete storyboard following these steps:

**Step 1: Parse & Categorize Input**
Extract and organize the event details into:
- **Event:** title, date/time, context
- **Location:** name, address, environment description (architecture, vegetation, weather, lighting)  
- **People:** names, ages, roles, clothing, physical features, emotional state
- **Actions:** what each person is doing, sequence of key moments
- **Props & Objects:** instruments, vehicles, décor, tech, symbolic items
- **Mood & Tone:** music style, color palette, camera movement (steady, handheld, drone)
- **References:** real-world photos, films, art styles to emulate

**Step 2: Generate Scene Breakdown**
For each scene, create:
1. **Scene header:** "Scene X – [Event Name]: [Location], [Time of day]"
2. **Shot list with:**
   - Shot type (close-up, wide, tracking, etc.)
   - Subject (who or what)
   - Action described in one sentence
   - Camera movement & lens choice
   - Lighting notes

**Step 3: Create Photo-Realistic Image Prompts**
For each shot, craft detailed prompts like:
"A wide-angle dusk shot of [Person name, description] standing under a neon sign in a rainy Tokyo alley, glistening pavement, dramatic low-key lighting, cinematic 35mm film look, realistic skin textures, subtle motion blur."

**Step 4: Cross-Reference & Validation**
Ensure every person, place, and prop in your prompts matches the original input data. Flag missing details if needed.

**Guidelines for Image Prompts:**
- Include specific camera angles and lens choices
- Describe lighting conditions in detail
- Mention specific textures, materials, and surfaces
- Add atmospheric elements (fog, rain, sunlight, etc.)
- Specify the overall cinematic style
- Include emotion and mood descriptors
- Use photorealistic rendering terms

**Output the complete storyboard as a structured JSON with scenes array.**`,
});

const generateStoryboardFlow = ai.defineFlow(
  {
    name: 'generateStoryboardFlow',
    inputSchema: GenerateStoryboardInputSchema,
    outputSchema: GenerateStoryboardOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    
    if (!output) {
      return { 
        scenes: [{
          sceneHeader: "Scene 1 - Error: Unable to process event",
          shots: [{
            type: "medium",
            subject: "System",
            action: "Unable to generate storyboard from provided description",
            camera: "Static medium shot",
            lighting: "Neutral lighting",
            imagePrompt: "A simple placeholder image indicating storyboard generation failed"
          }]
        }]
      };
    }

    return output;
  }
);