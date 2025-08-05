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
Create 2-4 scenes that capture the key moments. For each scene:
1. **Scene header:** "Scene [number] – [Event Name]: [Location], [Time of day]"
2. **Shot list:** 2-5 shots per scene with:
   - Shot type: Choose from close-up, medium, wide, extreme-wide, tracking, dolly, crane
   - Subject: Specific person or object being featured
   - Action: Single sentence describing what's happening
   - Camera: Movement style and lens choice (e.g. "Handheld 50mm tracking shot" or "Static wide-angle 24mm")
   - Lighting: Specific lighting setup and mood

**Step 3: Create Photo-Realistic Image Prompts**
For each shot, craft detailed prompts using this structure:
"[Shot type] of [detailed subject description] [action], [setting details], [lighting description], [camera/lens specs], [artistic style], [texture and material details], [atmospheric elements]"

Example: "A cinematic wide-angle shot of Sarah, a 25-year-old woman with curly brown hair wearing an emerald green flowing dress, laughing joyfully while surrounded by friends on a modern rooftop terrace, string lights creating warm bokeh in the background, golden hour lighting with soft shadows, shot on 35mm film with shallow depth of field, realistic skin textures and fabric details, warm evening atmosphere with city lights beginning to twinkle"

**Step 4: Cross-Reference & Validation**
Ensure consistency:
- Every person mentioned appears in image prompts with consistent descriptions
- Location details match throughout all scenes  
- Lighting and time of day progress logically
- Props and objects are consistently described

**Guidelines for Professional Image Prompts:**
- Start with shot type and camera specifics
- Include detailed physical descriptions of people (age, hair, clothing, expressions)
- Describe exact lighting setup (golden hour, studio lighting, natural window light, etc.)
- Mention camera technical details (lens focal length, depth of field, film grain)
- Add environmental atmosphere (steam, fog, rain, dust particles, etc.)
- Include texture details (fabric, skin, metal, wood surfaces)
- Specify artistic style (cinematic, documentary, portrait, etc.)
- End with overall mood and color palette

Return a valid JSON response with the scenes array containing the complete storyboard.`,
});

const generateStoryboardFlow = ai.defineFlow(
  {
    name: 'generateStoryboardFlow',
    inputSchema: GenerateStoryboardInputSchema,
    outputSchema: GenerateStoryboardOutputSchema,
  },
  async (input) => {
    try {
      // Validate input
      if (!input.eventDescription || input.eventDescription.trim().length < 10) {
        throw new Error('Event description must be at least 10 characters long');
      }

      const {output} = await prompt(input);
      
      if (!output) {
        throw new Error('AI model did not return a valid response');
      }

      // Validate the output structure
      if (!output.scenes || output.scenes.length === 0) {
        throw new Error('Generated storyboard must contain at least one scene');
      }

      // Validate each scene has required shots
      for (let i = 0; i < output.scenes.length; i++) {
        const scene = output.scenes[i];
        if (!scene.shots || scene.shots.length === 0) {
          throw new Error(`Scene ${i + 1} must contain at least one shot`);
        }
        
        // Validate each shot has all required fields
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
      
      // Return a fallback storyboard structure
      return { 
        scenes: [{
          sceneHeader: `Scene 1 - Error Processing: ${error instanceof Error ? error.message : 'Unknown error'}`,
          shots: [{
            type: "medium",
            subject: "Error state",
            action: "Unable to generate storyboard from the provided description",
            camera: "Static medium shot with standard lens",
            lighting: "Neutral studio lighting",
            imagePrompt: "A simple error placeholder showing that storyboard generation failed due to insufficient or invalid input data. The image should be clean and professional, indicating a technical issue that needs to be resolved."
          }],
          dialogue: "Error occurred during storyboard generation"
        }]
      };
    }
  }
);