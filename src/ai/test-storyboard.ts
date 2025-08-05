/**
 * Test file for storyboard generation
 * This demonstrates how to use the generateStoryboard flow
 */

import { generateStoryboard } from './flows/generate-storyboard';

async function testStoryboardGeneration() {
  console.log('Testing storyboard generation...');

  const testEvent = {
    eventDescription: `
      Event: "Sarah's 25th Birthday Party"
      Date: Saturday evening, June 15th, 2024
      Location: Downtown rooftop bar called "Sky Lounge" - modern glass building, city skyline view, string lights, wooden deck furniture
      
      People:
      - Sarah (25, birthday girl): wearing a flowing emerald green dress, curly brown hair, joyful and excited
      - Mike (27, best friend): casual button-down shirt, photographer for the evening, caring and attentive
      - Emma (24, sister): black cocktail dress, blonde hair in updo, emotional and proud
      - Various friends and family (8-10 people): mix of casual and semi-formal attire
      
      Key moments:
      1. Guests arriving as sun sets, city lights beginning to twinkle
      2. Sarah's surprise reaction when she sees the decorated space
      3. Mike taking candid photos of Sarah laughing with friends
      4. Emma giving a heartfelt toast with champagne
      5. Group dancing under the string lights
      6. Quiet moment between Sarah and Emma looking out at the city
      
      Mood: Warm, celebratory, intimate despite being in a big city. Golden hour lighting transitioning to evening ambiance. Upbeat indie folk music playing. Color palette of warm golds, emerald greens, and soft blues from the city lights.
      
      Props: String lights, champagne glasses, birthday cake, Mike's camera, potted plants around the rooftop, city skyline backdrop.
    `
  };

  try {
    const result = await generateStoryboard(testEvent);
    console.log('Storyboard generation successful!');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error generating storyboard:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testStoryboardGeneration();
}

export { testStoryboardGeneration };