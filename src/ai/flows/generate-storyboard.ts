'use server';
/**
 * @fileOverview AI flow to transform raw event data into structured movie/video storyboards
 * and ultra-photo-realistic image prompts.
 *
 * - generateStoryboard - Main function that processes raw event data
 * - GenerateStoryboardInput - Input schema for event data
 * - GenerateStoryboardOutput - Output schema with structured scenes and prompts
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
  prompt: `You are an expert AI production assistant specializing in transforming raw event data into fully structured movie/video storyboards and ultra-photo-realistic image prompts. Your goal is to capture each moment and each person's unique appearance as if we were there.

STEP 1: PARSE & CATEGORIZE INPUT
Parse the following event data and extract into a structured schema:

Event Data: {{{eventData}}}

STEP 2: ANALYZE AND STRUCTURE
Organize the data into:
- **Event:** title, date/time, context
- **Location:** name, address, environment description (architecture, vegetation, weather, lighting)
- **People:** For each person:
  - Identity: name, age, role
  - Appearance: height, build, skin tone, hair color/style, eye color, distinguishing features (scars, glasses, facial hair)
  - Clothing & accessories: style, colors, textures
  - Expression & posture: emotional state, body language
- **Actions:** what each person is doing, sequence of key moments
- **Props & Objects:** instruments, vehicles, décor, tech, symbolic items
- **Mood & Tone:** music style, color palette, camera movement (steady, handheld, drone)
- **References:** real-world photos, films, art styles to emulate

STEP 3: GENERATE SCENE BREAKDOWN
For each scene, create:
1. **Scene header:** "Scene 1 – [Event Name]: [Location], [Time of day]"
2. **Shot list:**
   - Shot type (e.g. close-up, wide, tracking)
   - Subject (who or what)
   - Action described in one sentence
   - Camera movement & lens choice
   - Lighting notes
3. **Dialogue/voice-over** (if any)

STEP 4: CREATE ULTRA-PHOTO-REALISTIC IMAGE PROMPTS
For each shot, craft a detailed text prompt that includes:
- Exact facial features & look of each person (skin tone, eye color, hair style, facial hair, any distinguishing marks)
- Clothing textures and colors
- Environmental details (lighting, weather, background elements)
- Cinematic camera and lens cues (e.g. "35mm film grain," "shallow depth of field," "soft golden hour backlight")

Example prompt format:
"Close-up portrait at dusk of Maria Delgado (late 30s, olive skin, long wavy dark brown hair tucked behind ear, warm brown eyes, small beauty mark under right eye) smiling softly under a string of festival lights in a cobblestone plaza, wearing a deep emerald silk scarf and vintage leather jacket, cinematic 50mm lens, glowing bokeh, realistic skin texture and subtle catchlights."

STEP 5: CROSS-REFERENCE & VALIDATION
- Confirm every facial feature, clothing detail, and environment element matches the original data
- Flag any missing appearance details:
  - "Missing eye color for John Smith—please provide to ensure likeness."
  - "Hair style not specified for Sarah Johnson"
  - "Clothing description incomplete for Mike Chen"

REQUIREMENTS:
- Each person must have consistent appearance across all shots
- Image prompts must be cinematic quality with specific camera/lens details
- Include environmental atmosphere (lighting, weather, mood)
- Maintain narrative continuity across scenes
- Flag any ambiguous or missing details for validation

Return a complete structured JSON response with parsed data, scene breakdowns, and validation issues.`,
});

const generateStoryboardFlow = ai.defineFlow(
  {
    name: 'generateStoryboardFlow',
    inputSchema: GenerateStoryboardInputSchema,
    outputSchema: GenerateStoryboardOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output;
  }
);