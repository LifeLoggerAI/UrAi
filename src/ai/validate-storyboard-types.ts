/**
 * Simple validation test for storyboard generation types and structure
 */

import { 
  GenerateStoryboardInputSchema,
  GenerateStoryboardOutputSchema,
  type GenerateStoryboardInput,
  type GenerateStoryboardOutput 
} from '../lib/types';

function validateStoryboardTypes() {
  console.log('Validating storyboard generation types...');

  // Test input validation
  const testInput: GenerateStoryboardInput = {
    eventDescription: "A test event description"
  };

  try {
    const validatedInput = GenerateStoryboardInputSchema.parse(testInput);
    console.log('✅ Input schema validation passed');
    console.log('Input:', validatedInput);
  } catch (error) {
    console.error('❌ Input schema validation failed:', error);
    return false;
  }

  // Test output structure
  const testOutput: GenerateStoryboardOutput = {
    scenes: [
      {
        sceneHeader: "Scene 1 - Test Event: Living Room, Evening",
        shots: [
          {
            type: "wide",
            subject: "Sarah sitting on couch",
            action: "Sarah relaxes with a cup of tea while reading",
            camera: "Wide establishing shot with 35mm lens, static tripod",
            lighting: "Warm table lamp lighting, soft shadows",
            imagePrompt: "A cinematic wide shot of a young woman with curly brown hair sitting comfortably on a beige couch in a cozy living room, holding a steaming mug of tea, reading a book, warm golden lighting from a table lamp creates soft shadows, 35mm film aesthetic, realistic textures, cozy interior design with plants and books"
          },
          {
            type: "close-up",
            subject: "Tea cup in Sarah's hands",
            action: "Steam rises from the warm tea",
            camera: "Close-up macro lens, shallow depth of field",
            lighting: "Warm ambient light, steam visible",
            imagePrompt: "An intimate close-up shot of delicate hands holding a ceramic tea mug, steam gently rising from the warm liquid, soft focus background, macro lens with shallow depth of field, warm golden hour lighting, photorealistic skin textures and ceramic details"
          }
        ],
        dialogue: "Peaceful evening moment, ambient room sounds"
      }
    ]
  };

  try {
    const validatedOutput = GenerateStoryboardOutputSchema.parse(testOutput);
    console.log('✅ Output schema validation passed');
    console.log('Output structure is valid');
    console.log('Number of scenes:', validatedOutput.scenes.length);
    console.log('Number of shots in first scene:', validatedOutput.scenes[0].shots.length);
  } catch (error) {
    console.error('❌ Output schema validation failed:', error);
    return false;
  }

  console.log('✅ All type validations passed!');
  return true;
}

// Run validation
if (require.main === module) {
  validateStoryboardTypes();
}

export { validateStoryboardTypes };