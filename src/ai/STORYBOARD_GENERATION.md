# Storyboard Generation System

This AI flow transforms raw event descriptions into fully structured movie/video storyboards with photo-realistic image prompts for each shot.

## Features

- **Intelligent Event Parsing**: Extracts structured data from natural language descriptions
- **Professional Shot Planning**: Generates cinematic shot lists with technical specifications
- **Photo-Realistic Prompts**: Creates detailed image generation prompts for each shot
- **Cross-Reference Validation**: Ensures consistency across all scenes and shots
- **Error Handling**: Robust error handling with fallback responses

## Usage

### Basic Usage

```typescript
import { generateStoryboard } from '@/ai/flows/generate-storyboard';

const eventDescription = `
  Event: "Sarah's 25th Birthday Party"
  Date: Saturday evening, June 15th, 2024
  Location: Downtown rooftop bar "Sky Lounge" - modern glass building, city skyline view
  
  People:
  - Sarah (25, birthday girl): emerald green dress, curly brown hair, joyful
  - Mike (27, photographer): button-down shirt, caring, taking photos
  - Emma (24, sister): black cocktail dress, blonde updo, emotional
  
  Key moments:
  1. Guests arriving at sunset
  2. Sarah's surprise reaction
  3. Mike taking candid photos
  4. Emma's champagne toast
  5. Group dancing under string lights
`;

const result = await generateStoryboard({ eventDescription });
```

### Output Structure

```json
{
  "scenes": [
    {
      "sceneHeader": "Scene 1 - Sarah's Birthday Party: Sky Lounge Rooftop, Golden Hour",
      "shots": [
        {
          "type": "wide",
          "subject": "Sarah entering the decorated rooftop space",
          "action": "Sarah gasps in delighted surprise seeing the party setup",
          "camera": "Wide establishing shot with 24mm lens, static on tripod",
          "lighting": "Golden hour natural lighting with string light accents",
          "imagePrompt": "A cinematic wide-angle shot of Sarah, a 25-year-old woman with curly brown hair wearing an emerald green flowing dress, standing at the entrance of a modern rooftop terrace, hands covering her mouth in surprise, string lights creating warm bokeh in the background, golden hour lighting casting soft shadows, shot on 35mm film with shallow depth of field, realistic skin textures and fabric details, warm evening atmosphere with city skyline visible"
        }
      ],
      "dialogue": "Surprise! Happy Birthday Sarah!"
    }
  ]
}
```

## Input Requirements

The `eventDescription` should include:

- **Event details**: Title, date/time, context
- **Location**: Name, address, environment description
- **People**: Names, ages, roles, clothing, physical features, emotional states
- **Actions**: Sequence of key moments
- **Props & Objects**: Important items in the scene
- **Mood & Tone**: Atmosphere, lighting, style preferences

## Shot Types Available

- `close-up`: Tight framing on face or object
- `medium`: Mid-body shot
- `wide`: Full environment establishing shot
- `extreme-wide`: Very wide landscape/architectural shot
- `tracking`: Moving camera following subject
- `dolly`: Camera moving on track/wheels
- `crane`: High angle camera movement

## Image Prompt Structure

Each image prompt includes:
1. **Shot type and camera specs**
2. **Detailed subject descriptions**
3. **Specific action/pose**
4. **Environment/setting details**
5. **Lighting setup and mood**
6. **Technical camera details**
7. **Artistic style and atmosphere**
8. **Texture and material specifics**

## Error Handling

The system includes comprehensive error handling:
- Input validation (minimum description length)
- Output structure validation
- Individual shot validation
- Fallback error scenes with helpful messages

## Integration Examples

### With UI Components

```typescript
// In a React component
const [storyboard, setStoryboard] = useState(null);
const [loading, setLoading] = useState(false);

const handleGenerateStoryboard = async (description: string) => {
  setLoading(true);
  try {
    const result = await generateStoryboard({ eventDescription: description });
    setStoryboard(result);
  } catch (error) {
    console.error('Failed to generate storyboard:', error);
  } finally {
    setLoading(false);
  }
};
```

### With Image Generation APIs

```typescript
// Generate images for each shot
const generateStoryboardImages = async (storyboard: StoryboardOutput) => {
  const imageUrls = [];
  
  for (const scene of storyboard.scenes) {
    for (const shot of scene.shots) {
      // Use shot.imagePrompt with your preferred image generation API
      const imageUrl = await generateImage(shot.imagePrompt);
      imageUrls.push(imageUrl);
    }
  }
  
  return imageUrls;
};
```

### With Video Production Pipeline

```typescript
// Convert storyboard to video production format
const convertToVideoFormat = (storyboard: StoryboardOutput) => {
  return storyboard.scenes.map((scene, sceneIndex) => ({
    sceneNumber: sceneIndex + 1,
    location: scene.sceneHeader.split(':')[1]?.trim(),
    shots: scene.shots.map((shot, shotIndex) => ({
      shotNumber: shotIndex + 1,
      shotType: shot.type,
      description: shot.action,
      cameraInstructions: shot.camera,
      lightingNotes: shot.lighting,
      imageReference: shot.imagePrompt
    }))
  }));
};
```

## Best Practices

1. **Detailed Descriptions**: Provide rich, specific details about people, locations, and actions
2. **Clear Structure**: Organize your input with clear sections for different elements
3. **Context Matters**: Include emotional context and atmosphere descriptions
4. **Technical Specificity**: If you have preferences for camera work or lighting, include them
5. **Validation**: Always validate the output structure before using in production

## Troubleshooting

### Common Issues

1. **Empty or minimal output**: Ensure your event description is detailed and at least 50+ words
2. **Generic image prompts**: Provide more specific details about people, clothing, and environment
3. **Inconsistent character descriptions**: Use consistent names and descriptions throughout
4. **Missing technical details**: The system will generate camera/lighting specs, but you can guide it with preferences

### Error Messages

- `Event description must be at least 10 characters long`: Provide a more detailed description
- `Generated storyboard must contain at least one scene`: The AI couldn't parse your input effectively
- `Scene X must contain at least one shot`: Individual scenes lack sufficient detail
- `Shot X in Scene Y must have a detailed image prompt`: The AI couldn't generate adequate visual descriptions