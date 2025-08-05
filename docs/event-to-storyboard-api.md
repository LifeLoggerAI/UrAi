# Event-to-Storyboard AI System

This system transforms raw event data into fully structured movie/video storyboards with ultra-photo-realistic image prompts that capture each moment and each person's unique appearance.

## Overview

The system processes events through a 5-step pipeline:

1. **Parse & Categorize**: Extract structured data from raw event descriptions
2. **Generate Scene Breakdown**: Create cinematic scenes with shot lists
3. **Create Image Prompts**: Generate ultra-photo-realistic prompts for each shot
4. **Cross-reference & Validation**: Ensure consistency and flag missing details
5. **Output**: Return structured JSON for video/image generation pipelines

## API Usage

### Main Function

```typescript
import { eventToStoryboard } from '@/ai/flows/event-to-storyboard';
import type { EventToStoryboardInput, EventToStoryboardOutput } from '@/lib/types';

const input: EventToStoryboardInput = {
  rawEventData: "Your event description here..."
};

const result: EventToStoryboardOutput = await eventToStoryboard(input);
```

### Input Format

The `rawEventData` can be either:
- **Plain text description** of the event
- **JSON string** with structured event details

Example input:
```
Event: Birthday Celebration
Date: Saturday evening
Location: Garden restaurant with string lights

People:
- Maria (35): Latina woman, olive skin, long dark hair, green dress
- James (38): Asian man, navy shirt, warm smile

Actions:
1. Guests arriving
2. Blowing out candles
3. Dancing to music

Location: Outdoor garden with stone fountain, warm lighting
Props: Birthday cake, wine glasses, string lights
Mood: Joyful, celebratory
```

### Output Format

Returns a structured JSON object:

```typescript
{
  scenes: [
    {
      sceneHeader: "Scene 1 – Birthday Celebration: Garden Restaurant, Evening",
      shots: [
        {
          type: "wide shot",
          subject: "Maria and guests",
          action: "Guests arriving and greeting Maria at garden entrance",
          camera: "handheld 35mm for intimacy",
          lighting: "warm golden hour with string lights",
          imagePrompt: "Wide establishing shot at golden hour of Maria Delgado (35, olive skin, long wavy dark brown hair, warm brown eyes, small beauty mark under right eye) greeting guests in flowing emerald green silk dress at garden restaurant entrance, string lights glowing overhead, cobblestone pathway, lush greenery, handheld 35mm film grain, warm ambient lighting..."
        }
      ],
      dialogue: "Optional dialogue or voice-over"
    }
  ],
  missingDetails: [
    "Missing eye color for James Chen—please provide to ensure likeness."
  ]
}
```

## Individual Flow Functions

You can also use the individual flows separately:

### 1. Parse Event Data
```typescript
import { parseEventData } from '@/ai/flows/parse-event-data';

const parsed = await parseEventData({
  rawEventData: "Your event description..."
});
```

### 2. Generate Scene Breakdown
```typescript
import { generateSceneBreakdown } from '@/ai/flows/generate-scene-breakdown';

const scenes = await generateSceneBreakdown({
  eventData: parsedEventData
});
```

### 3. Generate Image Prompts
```typescript
import { generateImagePrompts } from '@/ai/flows/generate-image-prompts';

const prompts = await generateImagePrompts({
  eventData: parsedEventData,
  sceneBreakdown: scenes
});
```

## Structured Data Schema

### Event Input Schema
```typescript
type EventInput = {
  title: string;
  date?: string;
  time?: string;
  context: string;
  location: {
    name: string;
    address?: string;
    environment: string;
    timeOfDay?: string;
    lighting: string;
    weather?: string;
    architecture?: string;
    vegetation?: string;
  };
  people: Array<{
    name: string;
    age?: number;
    role?: string;
    height?: string;
    build?: string;
    skinTone?: string;
    hairColor?: string;
    hairStyle?: string;
    eyeColor?: string;
    distinguishingFeatures?: string[];
    clothing?: string;
    accessories?: string[];
    expression?: string;
    posture?: string;
    emotionalState?: string;
  }>;
  actions: Array<{
    person: string;
    action: string;
    sequence: number;
    duration?: string;
  }>;
  props?: string[];
  mood?: string;
  colorPalette?: string[];
  cameraMovement?: string;
  musicStyle?: string;
  references?: string[];
}
```

## Image Prompt Examples

The system generates detailed prompts like:

```
"Close-up portrait at dusk of Maria Delgado (late 30s, olive skin, long wavy dark brown hair tucked behind ear, warm brown eyes, small beauty mark under right eye) smiling softly under a string of festival lights in a cobblestone plaza, wearing a deep emerald silk scarf and vintage leather jacket, cinematic 50mm lens, glowing bokeh, realistic skin texture and subtle catchlights."
```

Each prompt includes:
- **Exact facial features**: skin tone, eye color, hair details, distinguishing marks
- **Clothing textures**: specific fabrics, colors, fit
- **Environmental details**: lighting, weather, background elements  
- **Cinematic cues**: lens choice, depth of field, film grain, lighting style

## Validation and Quality Assurance

The system automatically:
- ✅ Validates all person appearance details are included
- ✅ Ensures lighting and mood consistency across scenes
- ✅ Cross-references image prompts with original event data
- ✅ Flags missing critical information
- ✅ Maintains visual continuity between shots

## Best Practices

### For Input Data
- Include specific physical descriptions for all people
- Provide lighting and time-of-day information
- Describe clothing materials and colors in detail
- Include emotional context and mood

### For Missing Details
- The system will flag any missing appearance details
- Provide additional information for flagged items to improve output quality
- Eye color, hair color, and skin tone are critical for person likeness

### For Cinematic Quality
- The system automatically selects appropriate shot types
- Camera movements match the mood and intimacy of the event
- Lighting descriptions ensure photorealistic rendering

## Integration

This system is designed to integrate with:
- **Video generation pipelines**: Use scenes and shots for video editing
- **Image generation APIs**: Use imagePrompts with AI image generators
- **Storyboard tools**: Export scenes as traditional storyboards
- **Production planning**: Use as pre-visualization for filming

## Error Handling

The system provides detailed error reporting:
- Parse failures will indicate which part of the event data is unclear
- Missing critical details are flagged with specific guidance
- AI generation failures include retry suggestions