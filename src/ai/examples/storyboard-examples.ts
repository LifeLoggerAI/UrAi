/**
 * Example usage of the generateStoryboard flow
 * This file demonstrates how to use the AI production assistant
 * to transform raw event data into structured storyboards.
 */

import { generateStoryboard } from '../flows/generate-storyboard';
import type { GenerateStoryboardInput } from '@/lib/types';

// Example 1: Simple birthday party
const birthdayPartyExample: GenerateStoryboardInput = {
  eventDescription: `Sarah's 30th birthday party at Central Park. It was a sunny Saturday afternoon in June. About 15 friends gathered near the boathouse for a picnic celebration. Sarah is a tall woman with curly red hair, green eyes, and a bright smile. She was wearing a flowing blue sundress and sandals. Her best friend Mike brought his guitar and played some acoustic songs. There was a decorated cake, balloons, and everyone was laughing and enjoying the beautiful weather. The party lasted about 3 hours with lots of photos taken by the lake.`
};

// Example 2: Wedding ceremony with detailed JSON input (simplified for stub compatibility)
const weddingExample: GenerateStoryboardInput = {
  eventDescription: `Emma and David's Wedding Ceremony on September 15, 2024, at Sunset Vineyard Estate. Outdoor ceremony with golden hour sunlight.`
};

// Example usage function
export async function runStoryboardExamples() {
  console.log('=== Birthday Party Example ===');
  try {
    const birthdayResult = await generateStoryboard(birthdayPartyExample);
    console.log('Generated scenes:', birthdayResult?.scenes.length);
    // No longer checking for validationIssues as it's not in the stub
  } catch (error) {
    console.error('Error generating birthday storyboard:', error);
  }

  console.log('\n=== Wedding Ceremony Example ===');
  try {
    const weddingResult = await generateStoryboard(weddingExample);
    console.log('Generated scenes:', weddingResult?.scenes.length);
    // No longer checking for validationIssues as it's not in the stub
  } catch (error) {
    console.error('Error generating wedding storyboard:', error);
  }
}
