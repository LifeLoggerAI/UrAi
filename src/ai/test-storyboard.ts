<<<<<<< HEAD
/**
 * Comprehensive test scenarios for storyboard generation
 */

import { 
  GenerateStoryboardInputSchema,
  GenerateStoryboardOutputSchema,
  type GenerateStoryboardInput,
  type GenerateStoryboardOutput 
} from '../lib/types';
=======

// src/ai/test-storyboard.ts
// This file is used for testing purposes only and should not be included in production builds.
// It provides a mock implementation of the storyboard generation flow.

// Import necessary modules and types
import { type GenerateStoryboardOutput } from '@/lib/types';
import { type ExecutablePrompt } from 'genkit'
>>>>>>> 5be23281 (Commit before pulling remote changes)

// Test scenarios
const testScenarios = {
  detailedBirthdayParty: {
    eventDescription: `
      Event: "Sarah's 25th Birthday Celebration"
      Date: Saturday evening, June 15th, 2024 at 7:00 PM
      Location: Sky Lounge - Downtown rooftop bar on 15th floor, modern glass building with panoramic city views, exposed brick walls, wooden deck furniture, string lights overhead, urban garden with potted plants
      
      Weather: Clear evening, temperature 72°F, light breeze, golden hour transitioning to evening
      
      People:
      - Sarah Chen (25, birthday girl): 5'6", curly brown shoulder-length hair, wearing flowing emerald green midi dress, gold jewelry, bright smile, excited and joyful demeanor
      - Mike Rodriguez (27, best friend & photographer): 6'0", short black hair, casual navy button-down shirt, dark jeans, carrying professional camera, warm and attentive personality
      - Emma Chen (24, younger sister): 5'4", blonde hair in elegant updo, black cocktail dress, silver heels, emotional and proud, tends to tear up during speeches
      - James Wilson (26, Sarah's boyfriend): 5'10", brown hair styled back, charcoal blazer over white t-shirt, caring and supportive
      - Additional guests: 8-10 close friends and family members in smart casual attire
      
      Key Action Sequence:
      1. [7:00 PM] Guests arrive and hide, final decorations being adjusted
      2. [7:15 PM] Sarah arrives, sees the surprise setup, emotional reaction
      3. [7:20 PM] Hugs and greetings, Mike capturing candid moments
      4. [7:45 PM] Sunset cocktail hour, mingling on the terrace
      5. [8:15 PM] Emma delivers heartfelt toast with champagne
      6. [8:30 PM] Dancing begins under the string lights
      7. [9:00 PM] Cake ceremony and candle blowing
      8. [9:30 PM] Quiet moment between Sarah and Emma overlooking the city
      
      Props & Objects:
      - Professional DSLR camera (Canon 5D Mark IV)
      - Champagne glasses and bottles (Dom Pérignon)
      - Three-tier vanilla birthday cake with gold details
      - String lights draped overhead
      - Potted succulents and ferns as decorations
      - City skyline backdrop with twinkling lights
      - Cocktail bar setup with premium spirits
      - Bluetooth speaker playing indie folk playlist
      
      Mood & Atmosphere:
      - Music: Indie folk and acoustic singer-songwriter (Bon Iver, The Paper Kites)
      - Color palette: Warm golds, emerald greens, soft blues from city lights, amber string light glow
      - Camera style: Cinematic handheld with smooth movements, some static wide shots
      - Overall tone: Intimate, celebratory, heartwarming, slightly nostalgic
      
      Style References:
      - Film: "Her" (Spike Jonze) for warm, intimate city atmosphere
      - Photography: Jose Villa's style for warm, natural lighting
      - Art: Edward Hopper's urban evening scenes for mood
    `
  },

  simpleFamilyDinner: {
    eventDescription: `
      Event: "Sunday Family Dinner"
      Date: Sunday, 6:00 PM
      Location: Grandma's house - cozy dining room with wooden table
      
      People:
      - Grandma Mary (78): gray hair, floral dress, cooking
      - Dad Tom (45): casual shirt, helping set table
      - Mom Lisa (42): summer dress, organizing
      - Kids: Jake (12) and Emma (8) playing before dinner
      
      Actions:
      1. Family arriving and gathering
      2. Setting the table together
      3. Sharing meal and conversation
      4. Kids playing afterward
      
      Mood: Warm, family-oriented, traditional Sunday dinner atmosphere
    `
  },

  minimalInput: {
    eventDescription: "A quick coffee meeting between two friends at a local café."
  },

  invalidInput: {
    eventDescription: "Too short"
  }
};

<<<<<<< HEAD
function validateStoryboardStructure(output: GenerateStoryboardOutput): boolean {
=======
// keep it referenced so linters don't complain
// console.log("Test 5 mock structuredData present:", !!mockOutput.structuredData);

// Mock implementation of the generateStoryboard flow
export async function generateStoryboard(
  input: any
): Promise<GenerateStoryboardOutput | null> {
>>>>>>> 5be23281 (Commit before pulling remote changes)
  try {
    // The output has already been validated by Zod schema at this point
    // Just do some basic quality checks
    
    if (!output.scenes || output.scenes.length === 0) {
      console.error('❌ No scenes found');
      return false;
    }

    let totalShots = 0;
    for (let i = 0; i < output.scenes.length; i++) {
      const scene = output.scenes[i];
      totalShots += scene.shots.length;
      
      // Check image prompt quality
      for (let j = 0; j < scene.shots.length; j++) {
        const shot = scene.shots[j];
        if (shot.imagePrompt.length < 50) {
          console.error(`❌ Scene ${i + 1}, Shot ${j + 1} has insufficient image prompt detail (${shot.imagePrompt.length} chars, need 50+)`);
          return false;
        }
      }
    }

    console.log(`✅ Structure validation passed: ${output.scenes.length} scenes, ${totalShots} shots`);
    return true;
    
  } catch (error) {
    console.error('❌ Structure validation error:', error);
    return false;
  }
}

function testStoryboardValidation() {
  console.log('🎬 Testing Storyboard Generation Validation\n');

  // Test 1: Valid detailed input
  console.log('Test 1: Detailed Birthday Party Event');
  try {
    const input = GenerateStoryboardInputSchema.parse(testScenarios.detailedBirthdayParty);
    console.log('✅ Input validation passed');
    console.log(`   Event description length: ${input.eventDescription.length} characters`);
  } catch (error) {
    console.error('❌ Input validation failed:', error);
  }

  // Test 2: Simple input
  console.log('\nTest 2: Simple Family Dinner');
  try {
    const input = GenerateStoryboardInputSchema.parse(testScenarios.simpleFamilyDinner);
    console.log('✅ Input validation passed');
    console.log(`   Event description length: ${input.eventDescription.length} characters`);
  } catch (error) {
    console.error('❌ Input validation failed:', error);
  }

  // Test 3: Minimal input
  console.log('\nTest 3: Minimal Input');
  try {
    const input = GenerateStoryboardInputSchema.parse(testScenarios.minimalInput);
    console.log('✅ Input validation passed');
    console.log(`   Event description length: ${input.eventDescription.length} characters`);
  } catch (error) {
    console.error('❌ Input validation failed:', error);
  }

  // Test 4: Invalid input
  console.log('\nTest 4: Invalid Input');
  try {
    const input = GenerateStoryboardInputSchema.parse(testScenarios.invalidInput);
    console.log('✅ Input validation passed (unexpected)');
  } catch (error) {
    console.log('✅ Input validation correctly rejected invalid input');
  }

  // Test 5: Output structure validation
  console.log('\nTest 5: Output Structure Validation');
  const mockOutput: GenerateStoryboardOutput = {
    scenes: [
      {
        sceneHeader: "Scene 1 - Birthday Party: Rooftop Terrace, Golden Hour",
        shots: [
          {
            type: "wide",
            subject: "Sarah and friends on rooftop terrace",
            action: "Group gathers around the surprise birthday setup",
            camera: "Wide establishing shot with 24mm lens, handheld movement",
            lighting: "Golden hour natural light with string light accents",
            imagePrompt: "A cinematic wide-angle shot of a diverse group of young adults gathered on a modern rooftop terrace during golden hour, string lights creating warm bokeh, city skyline in background, natural warm lighting, shot on 35mm film with shallow depth of field, realistic textures and expressions, celebratory atmosphere"
          },
          {
            type: "close-up",
            subject: "Sarah's face showing surprise and joy",
            action: "Sarah's emotional reaction to seeing the party setup",
            camera: "Intimate close-up with 85mm lens, slight handheld movement",
            lighting: "Soft golden hour light from the side, natural skin tones",
            imagePrompt: "An intimate close-up portrait of Sarah, a 25-year-old woman with curly brown hair, her face showing genuine surprise and joy, eyes slightly teary with happiness, wearing emerald green dress, soft golden hour lighting from the side creating warm skin tones, shot with 85mm lens with beautiful bokeh, photorealistic skin textures and emotional expression"
          }
        ],
        dialogue: "Surprise! Happy Birthday Sarah!"
      },
      {
        sceneHeader: "Scene 2 - Birthday Party: Rooftop Terrace, Evening",
        shots: [
          {
            type: "medium",
            subject: "Emma giving champagne toast",
            action: "Emma raises glass and delivers heartfelt birthday speech",
            camera: "Medium shot with 50mm lens, static on tripod",
            lighting: "String lights and ambient city glow, warm atmosphere",
            imagePrompt: "A medium shot of Emma, a 24-year-old woman with blonde hair in elegant updo wearing a black cocktail dress, raising a champagne glass in toast, emotional expression with slight tears of joy, string lights creating warm ambient lighting, city lights twinkling in background, shot with 50mm lens, cinematic composition with realistic textures and lighting"
          }
        ]
      }
    ]
  };

  try {
    const validatedOutput = GenerateStoryboardOutputSchema.parse(mockOutput);
    console.log('✅ Output schema validation passed');
    
    if (validateStoryboardStructure(validatedOutput)) {
      console.log('✅ Output structure validation passed');
      console.log(`   Total scenes: ${validatedOutput.scenes.length}`);
      console.log(`   Total shots: ${validatedOutput.scenes.reduce((sum, scene) => sum + scene.shots.length, 0)}`);
    }
  } catch (error) {
    console.error('❌ Output validation failed:', error);
  }

  console.log('\n🎉 All validation tests completed!');
}

// Export for use in other files
export { testScenarios, validateStoryboardStructure, testStoryboardValidation };

// Run tests if this file is executed directly
if (require.main === module) {
  testStoryboardValidation();
}