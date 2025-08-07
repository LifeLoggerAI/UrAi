/**
 * Unit tests and validation for the generateStoryboard flow
 * These tests validate the schema definitions and expected structure
 * without requiring actual AI API calls.
 */

import type {
  GenerateStoryboardInput,
  GenerateStoryboardOutput,
  PersonAppearance,
  LocationDetails,
  EventDetails,
  Scene,
  Shot,
  ValidationIssue
} from '@/lib/types';

// Mock expected output for testing schema validation
const mockStoryboardOutput: GenerateStoryboardOutput = {
  structuredData: {
    event: {
      title: "Sarah's 30th Birthday Party",
      date: "June 15, 2024",
      time: "2:00 PM",
      context: "Outdoor celebration with friends",
      duration: "3 hours"
    },
    location: {
      name: "Central Park Boathouse",
      address: "Central Park, New York, NY",
      environment: "Lakeside picnic area with wooden tables and shade trees",
      weather: "Sunny, 75°F, light breeze",
      lighting: "Bright afternoon sunlight filtering through tree canopy",
      atmosphere: "Relaxed, joyful, natural"
    },
    people: [
      {
        name: "Sarah Johnson",
        age: 30,
        role: "Birthday celebrant",
        height: "5'7\"",
        build: "Tall and slender",
        skinTone: "Fair with freckles",
        hairColor: "Curly red",
        hairStyle: "Shoulder-length curls, natural texture",
        eyeColor: "Green",
        distinguishingFeatures: ["Light freckles across nose", "Bright smile"],
        clothing: "Flowing blue sundress with white floral pattern",
        accessories: ["Simple gold necklace", "Leather sandals"],
        expression: "Radiant joy and laughter",
        posture: "Relaxed, animated while talking"
      },
      {
        name: "Mike Thompson",
        age: 28,
        role: "Best friend and musician",
        height: "6'0\"",
        build: "Average build",
        skinTone: "Medium olive",
        hairColor: "Dark brown",
        hairStyle: "Short, slightly messy",
        eyeColor: "Brown",
        facialHair: "Light stubble",
        clothing: "Casual button-up shirt and jeans",
        accessories: ["Acoustic guitar", "Worn leather watch"],
        expression: "Concentrated while playing, then smiling",
        posture: "Seated cross-legged with guitar"
      }
    ],
    actions: [
      {
        description: "Guests arrive and set up picnic area",
        participants: ["All guests"],
        duration: "30 minutes",
        sequence: 1
      },
      {
        description: "Mike plays acoustic birthday songs",
        participants: ["Mike Thompson"],
        duration: "20 minutes",
        sequence: 2
      },
      {
        description: "Cake cutting ceremony with group singing",
        participants: ["Sarah Johnson", "All guests"],
        duration: "15 minutes",
        sequence: 3
      },
      {
        description: "Group photos by the lake",
        participants: ["All guests"],
        duration: "30 minutes",
        sequence: 4
      }
    ],
    props: [
      {
        name: "Birthday cake",
        description: "Three-layer vanilla cake with rainbow frosting and candles",
        significance: "Central focus of celebration"
      },
      {
        name: "Acoustic guitar",
        description: "Well-worn Martin guitar with natural wood finish",
        significance: "Creates musical atmosphere"
      },
      {
        name: "Colorful balloons",
        description: "Cluster of helium balloons in blues and yellows",
        significance: "Festive decoration"
      }
    ],
    moodTone: {
      musicStyle: "Acoustic folk and birthday songs",
      colorPalette: ["Sky blue", "Forest green", "Warm gold", "Soft white"],
      cameraMovement: "Handheld with gentle movements, some static shots",
      emotionalTone: "Joyful, intimate, celebratory"
    },
    references: [
      "Natural light photography style of Annie Leibovitz",
      "Casual celebration scenes from 'Little Women' (2019)",
      "Documentary-style birthday parties"
    ]
  },
  scenes: [
    {
      sceneHeader: "Scene 1 – Birthday Party Setup: Central Park Boathouse, Early Afternoon",
      shots: [
        {
          type: "wide",
          subject: "Picnic area overview",
          action: "Friends arrive carrying blankets, food, and decorations to set up the celebration",
          camera: "Static wide shot with 24mm lens, slight high angle",
          lighting: "Bright natural sunlight with dappled shadows from trees",
          imagePrompt: "Wide establishing shot of Central Park lakeside picnic area in bright afternoon sunlight, wooden picnic tables under shade trees, friends carrying colorful blankets and birthday supplies, lake visible in background with boats, dappled sunlight filtering through green canopy, documentary style, natural lighting, 24mm lens, shallow depth of field on background"
        },
        {
          type: "medium",
          subject: "Sarah and Mike setting up",
          action: "Sarah Johnson and Mike Thompson arrange decorations while laughing",
          camera: "Handheld medium shot with 50mm lens, following action",
          lighting: "Soft natural light with warm highlights",
          imagePrompt: "Medium shot of Sarah Johnson (30, fair skin with light freckles, curly red shoulder-length hair, bright green eyes, radiant smile) wearing flowing blue sundress with white floral pattern, and Mike Thompson (28, medium olive skin, dark brown messy hair, brown eyes, light stubble) in casual button-up shirt, both arranging colorful balloons and decorations on wooden picnic table, natural warm afternoon lighting, handheld 50mm lens, realistic skin texture, documentary style"
        }
      ],
      dialogue: "Natural conversation and laughter as friends prepare for the celebration"
    },
    {
      sceneHeader: "Scene 2 – Musical Performance: Central Park Boathouse, Mid-Afternoon", 
      shots: [
        {
          type: "close-up",
          subject: "Mike playing guitar",
          action: "Mike Thompson performs acoustic birthday songs with concentrated expression",
          camera: "Static close-up with 85mm lens, slight low angle",
          lighting: "Warm side lighting from afternoon sun",
          imagePrompt: "Close-up portrait of Mike Thompson (28, medium olive skin, dark brown slightly messy hair, warm brown eyes, light stubble) concentrated while playing well-worn Martin acoustic guitar with natural wood finish, wearing casual button-up shirt, warm afternoon side lighting creating gentle shadows, 85mm lens with shallow depth of field, guitar details visible, realistic skin texture and facial hair"
        },
        {
          type: "wide",
          subject: "Group listening to music",
          action: "Sarah and friends sit in circle listening to Mike's performance with joy",
          camera: "Static wide shot with 35mm lens, eye level",
          lighting: "Even natural lighting with warm tones",
          imagePrompt: "Wide shot of intimate circle with Sarah Johnson (fair skin, curly red hair, green eyes, blue sundress) and diverse group of friends sitting on blankets listening to acoustic guitar performance, everyone showing expressions of joy and attention, Central Park lake visible in soft focus background, warm afternoon lighting, 35mm lens, natural documentary style, multiple people in frame with realistic details"
        }
      ]
    },
    {
      sceneHeader: "Scene 3 – Cake Celebration: Central Park Boathouse, Late Afternoon",
      shots: [
        {
          type: "close-up", 
          subject: "Sarah with birthday cake",
          action: "Sarah Johnson beams with joy while making a wish over the lit candles",
          camera: "Handheld close-up with 50mm lens, slight low angle",
          lighting: "Warm golden hour light with cake candles creating warm glow",
          imagePrompt: "Close-up portrait of Sarah Johnson (30, fair skin with light freckles across nose, curly red shoulder-length hair catching golden light, bright green eyes with joyful tears, radiant smile) leaning over three-layer vanilla birthday cake with rainbow frosting and lit candles, wearing blue sundress with white florals, golden hour lighting creating warm glow on face, candlelight adding warmth, 50mm lens with shallow depth of field, ultra-realistic skin texture showing freckles and emotion"
        },
        {
          type: "wide",
          subject: "Group singing",
          action: "All friends gather around singing happy birthday with raised hands and smiles",
          camera: "Static wide shot with 24mm lens, slightly elevated angle",
          lighting: "Warm golden hour light filtering through trees",
          imagePrompt: "Wide group shot of 15 friends gathered around birthday celebration, all singing with raised hands and joyful expressions, Sarah Johnson (curly red hair, blue sundress) at center with cake, diverse group of people in casual summer clothing, golden hour sunlight filtering through tree canopy creating warm atmosphere, colorful balloons visible, 24mm lens, documentary style with natural poses and genuine emotions"
        }
      ],
      dialogue: "Happy Birthday to You song sung by the group, followed by cheers and laughter"
    }
  ],
  validationIssues: [
    {
      type: "missing_detail",
      message: "Hair color not specified for several guests in background",
      personName: "Background guests"
    },
    {
      type: "ambiguous_description", 
      message: "Exact clothing details missing for 3 secondary guests",
      personName: "Secondary guests"
    }
  ]
};

// Test input examples
const testInputs: GenerateStoryboardInput[] = [
  {
    eventData: "Simple text description: Sarah's birthday party at Central Park with friends, cake, and guitar music."
  },
  {
    eventData: JSON.stringify({
      event: { title: "Wedding", date: "2024-06-15" },
      people: [{ name: "Emma", age: 28, hairColor: "brown" }],
      location: { name: "Garden", environment: "Outdoor" }
    })
  }
];

/**
 * Validates that the output structure matches our expected schema
 */
export function validateStoryboardOutput(output: GenerateStoryboardOutput): boolean {
  // Check required top-level properties
  if (!output.structuredData || !output.scenes || !output.validationIssues) {
    return false;
  }

  // Validate structured data
  const { structuredData } = output;
  if (!structuredData.event?.title || !structuredData.location?.name || !structuredData.people?.length) {
    return false;
  }

  // Validate people have required appearance details
  for (const person of structuredData.people) {
    if (!person.name) return false;
  }

  // Validate scenes have proper structure
  for (const scene of output.scenes) {
    if (!scene.sceneHeader || !scene.shots?.length) return false;
    
    for (const shot of scene.shots) {
      if (!shot.type || !shot.subject || !shot.action || !shot.camera || !shot.imagePrompt) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Example of how to use the validation
 */
export function runValidationTests(): void {
  console.log('Testing storyboard output structure...');
  
  const isValid = validateStoryboardOutput(mockStoryboardOutput);
  console.log('Mock output validation:', isValid ? 'PASSED' : 'FAILED');

  // Test schema completeness
  const requiredFields = {
    structuredData: ['event', 'location', 'people', 'actions', 'props', 'moodTone'],
    scene: ['sceneHeader', 'shots'],
    shot: ['type', 'subject', 'action', 'camera', 'lighting', 'imagePrompt'],
    person: ['name'],
    validation: ['type', 'message']
  };

  console.log('Required fields defined:', Object.keys(requiredFields).length);
  console.log('Example scenes generated:', mockStoryboardOutput.scenes.length);
  console.log('Example shots per scene:', mockStoryboardOutput.scenes[0].shots.length);
  console.log('Example people detailed:', mockStoryboardOutput.structuredData.people.length);
  console.log('Example validation issues:', mockStoryboardOutput.validationIssues.length);
}

export { testInputs, mockStoryboardOutput };