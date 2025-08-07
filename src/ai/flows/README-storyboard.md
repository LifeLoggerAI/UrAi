# AI Storyboard Generation System

This system transforms raw event data into fully structured movie/video storyboards and ultra-photo-realistic image prompts that capture each moment and each person's unique appearance as if we were there.

## Overview

The `generateStoryboard` AI flow implements a comprehensive 5-step process:

1. **Parse & Categorize Input** - Extract structured data from text or JSON
2. **Generate Scene Breakdown** - Create scenes with detailed shot lists  
3. **Create Ultra-Photo-Realistic Image Prompts** - Detailed prompts for each shot
4. **Cross-Reference & Validation** - Ensure consistency and flag missing details
5. **Output Structured JSON** - Return data ready for video/image generation pipelines

## Input Format

The flow accepts raw event data as either:
- **Text description**: Natural language description of an event
- **JSON string**: Structured event data

```typescript
{
  eventData: string // Text description or JSON string of event details
}
```

## Output Structure

Returns a comprehensive JSON object with:

```typescript
{
  structuredData: {
    event: { title, date, time, context },
    location: { name, environment, weather, lighting },
    people: [{ name, appearance, clothing, expression }],
    actions: [{ description, participants, sequence }],
    props: [{ name, description, significance }],
    moodTone: { musicStyle, colorPalette, cameraMovement }
  },
  scenes: [
    {
      sceneHeader: "Scene 1 – [Event]: [Location], [Time]",
      shots: [
        {
          type: "wide|close-up|medium|tracking",
          subject: "who or what",
          action: "what happens in one sentence", 
          camera: "movement and lens choice",
          lighting: "lighting notes",
          imagePrompt: "ultra-detailed photo-realistic prompt"
        }
      ],
      dialogue: "optional voice-over or dialogue"
    }
  ],
  validationIssues: [
    {
      type: "missing_detail|ambiguous_description",
      message: "description of issue",
      personName: "person name if applicable"
    }
  ]
}
```

## Image Prompt Quality

Each shot includes an ultra-detailed image prompt with:
- **Exact facial features** - skin tone, eye color, hair style, distinguishing marks
- **Clothing details** - textures, colors, style descriptions
- **Environmental elements** - lighting, weather, background details  
- **Cinematic cues** - camera lens, depth of field, film grain, lighting style

### Example Image Prompt
```
"Close-up portrait at dusk of Maria Delgado (late 30s, olive skin, long wavy dark brown hair tucked behind ear, warm brown eyes, small beauty mark under right eye) smiling softly under a string of festival lights in a cobblestone plaza, wearing a deep emerald silk scarf and vintage leather jacket, cinematic 50mm lens, glowing bokeh, realistic skin texture and subtle catchlights."
```

## Usage Examples

### Simple Text Input
```typescript
import { generateStoryboard } from '@/ai/flows/generate-storyboard';

const result = await generateStoryboard({
  eventData: "Sarah's birthday party at Central Park. Sunny afternoon, 15 friends, cake and balloons by the lake..."
});
```

### Detailed JSON Input  
```typescript
const result = await generateStoryboard({
  eventData: JSON.stringify({
    event: { title: "Wedding Ceremony", date: "2024-09-15" },
    location: { name: "Vineyard Estate", environment: "Rolling hills..." },
    people: [
      {
        name: "Emma Rodriguez",
        age: 28,
        skinTone: "Warm olive",
        hairColor: "Dark brown",
        eyeColor: "Hazel",
        clothing: "Ivory silk A-line gown..."
      }
    ]
  })
});
```

## Validation & Quality Assurance

The system automatically:
- **Flags missing details** - eye color, hair style, clothing descriptions
- **Ensures consistency** - same person appears identically across shots
- **Validates completeness** - all key story elements are captured
- **Maintains continuity** - narrative flows logically between scenes

## Integration

- **File**: `/src/ai/flows/generate-storyboard.ts`
- **Types**: All schemas defined in `/src/lib/types.ts`
- **Examples**: See `/src/ai/examples/storyboard-examples.ts`

The flow integrates with the existing Genkit AI infrastructure and follows the same patterns as other AI flows in the system.

## Use Cases

- **Memory Documentation** - Transform life events into cinematic storyboards
- **Video Production** - Generate shot lists and image prompts for video creation
- **Photo Recreation** - Create detailed prompts for AI image generation
- **Storytelling** - Structure narratives with visual descriptions
- **Event Planning** - Pre-visualize events with detailed scene breakdowns