/**
 * Example usage of the generateStoryboard flow
 * This file demonstrates how to use the AI production assistant
 * to transform raw event data into structured storyboards.
 */

import { generateStoryboard } from '../flows/generate-storyboard';
import type { GenerateStoryboardInput } from '@/lib/types';

// Example 1: Simple birthday party
const birthdayPartyExample: GenerateStoryboardInput = {
  eventData: `Sarah's 30th birthday party at Central Park. It was a sunny Saturday afternoon in June. About 15 friends gathered near the boathouse for a picnic celebration. Sarah is a tall woman with curly red hair, green eyes, and a bright smile. She was wearing a flowing blue sundress and sandals. Her best friend Mike brought his guitar and played some acoustic songs. There was a decorated cake, balloons, and everyone was laughing and enjoying the beautiful weather. The party lasted about 3 hours with lots of photos taken by the lake.`
};

// Example 2: Wedding ceremony with detailed JSON input
const weddingExample: GenerateStoryboardInput = {
  eventData: JSON.stringify({
    event: {
      title: "Emma and David's Wedding Ceremony",
      date: "September 15, 2024",
      time: "4:00 PM",
      context: "Outdoor ceremony at vineyard estate"
    },
    location: {
      name: "Sunset Vineyard Estate",
      environment: "Rolling hills with vineyard rows, rustic wooden arch decorated with white roses and eucalyptus",
      weather: "Clear, warm autumn day",
      lighting: "Golden hour sunlight filtering through trees"
    },
    people: [
      {
        name: "Emma Rodriguez",
        age: 28,
        role: "Bride",
        height: "5'6\"",
        build: "Petite",
        skinTone: "Warm olive",
        hairColor: "Dark brown",
        hairStyle: "Elegant updo with loose tendrils",
        eyeColor: "Hazel",
        clothing: "Ivory silk A-line gown with lace sleeves and cathedral train",
        accessories: ["Pearl earrings", "Great-grandmother's diamond bracelet"],
        expression: "Radiant joy with tears of happiness"
      },
      {
        name: "David Chen",
        age: 30,
        role: "Groom",
        height: "6'1\"",
        build: "Athletic",
        skinTone: "Light",
        hairColor: "Black",
        hairStyle: "Classic side part",
        eyeColor: "Dark brown",
        facialHair: "Clean shaven",
        clothing: "Navy blue three-piece suit with ivory tie",
        accessories: ["Vintage watch", "Boutonnière with white rose"],
        expression: "Overwhelmed with emotion, wide smile"
      }
    ],
    actions: [
      {
        description: "Processional music begins, guests stand",
        participants: ["Wedding party", "Guests"],
        sequence: 1
      },
      {
        description: "Emma walks down aisle with her father",
        participants: ["Emma", "Father of bride"],
        sequence: 2
      },
      {
        description: "Emotional vow exchange",
        participants: ["Emma", "David"],
        sequence: 3
      },
      {
        description: "Ring exchange ceremony",
        participants: ["Emma", "David", "Ring bearer"],
        sequence: 4
      },
      {
        description: "First kiss as married couple",
        participants: ["Emma", "David"],
        sequence: 5
      }
    ],
    props: [
      {
        name: "Wedding rings",
        description: "Matching platinum bands with small diamonds"
      },
      {
        name: "Bridal bouquet",
        description: "White roses, eucalyptus, and baby's breath"
      }
    ],
    moodTone: {
      musicStyle: "Classical string quartet",
      colorPalette: ["Ivory", "Sage green", "Gold", "Blush pink"],
      cameraMovement: "Steady with smooth tracking shots",
      emotionalTone: "Romantic, joyful, timeless"
    }
  })
};

// Example usage function
export async function runStoryboardExamples() {
  console.log('=== Birthday Party Example ===');
  try {
    const birthdayResult = await generateStoryboard(birthdayPartyExample);
    console.log('Generated scenes:', birthdayResult?.scenes.length);
    console.log('Validation issues:', birthdayResult?.validationIssues.length);
  } catch (error) {
    console.error('Error generating birthday storyboard:', error);
  }

  console.log('\n=== Wedding Ceremony Example ===');
  try {
    const weddingResult = await generateStoryboard(weddingExample);
    console.log('Generated scenes:', weddingResult?.scenes.length);
    console.log('Validation issues:', weddingResult?.validationIssues.length);
  } catch (error) {
    console.error('Error generating wedding storyboard:', error);
  }
}

/**
 * Expected output structure:
 * {
 *   structuredData: {
 *     event: { title, date, time, context },
 *     location: { name, environment, weather, lighting },
 *     people: [{ name, appearance details, clothing, expression }],
 *     actions: [{ description, participants, sequence }],
 *     props: [{ name, description, significance }],
 *     moodTone: { musicStyle, colorPalette, cameraMovement, emotionalTone }
 *   },
 *   scenes: [
 *     {
 *       sceneHeader: "Scene 1 – Wedding Ceremony: Sunset Vineyard Estate, Late Afternoon",
 *       shots: [
 *         {
 *           type: "wide",
 *           subject: "Wedding venue overview",
 *           action: "Guests arriving and taking seats among vineyard rows",
 *           camera: "Drone shot with slow forward movement, 24mm lens",
 *           lighting: "Warm golden hour light filtering through trees",
 *           imagePrompt: "Wide aerial shot of elegant vineyard wedding venue at golden hour, rows of white chairs arranged in semicircle facing rustic wooden arch decorated with white roses and eucalyptus, rolling hills and grapevines in background, warm amber lighting, cinematic 24mm lens, shallow depth of field, film grain texture..."
 *         }
 *       ]
 *     }
 *   ],
 *   validationIssues: [
 *     {
 *       type: "missing_detail",
 *       message: "Eye color not specified for father of bride",
 *       personName: "Father of bride"
 *     }
 *   ]
 * }
 */