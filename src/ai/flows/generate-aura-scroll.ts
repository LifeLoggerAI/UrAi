'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for aura scroll generation
export const GenerateAuraScrollInputSchema = z.object({
  moodData: z.array(z.object({
    date: z.string(),
    emotion: z.string(),
    intensity: z.number(),
    events: z.array(z.string()).optional(),
  })).describe('Daily mood and emotion data'),
  significantEvents: z.array(z.object({
    description: z.string(),
    date: z.string(),
    emotional_impact: z.number(),
  })).optional().describe('Significant life events that affected mood'),
  startDate: z.string().describe('Start date for the scroll (YYYY-MM-DD)'),
  endDate: z.string().describe('End date for the scroll (YYYY-MM-DD)'),
});

export type GenerateAuraScrollInput = z.infer<typeof GenerateAuraScrollInputSchema>;

// Output schema for aura scroll
export const GenerateAuraScrollOutputSchema = z.object({
  weeklyAuraData: z.array(z.object({
    week: z.string().describe('Week identifier (YYYY-WXX)'),
    mood: z.string().describe('Dominant mood for the week'),
    color: z.string().describe('Hex color representing the mood'),
    overlays: z.array(z.string()).describe('Visual overlays like "fog", "storm", "bloom", etc.'),
  })),
  narratorQuotes: z.array(z.string()).describe('Poetic reflections for key emotional shifts'),
  overallArc: z.string().describe('The emotional journey narrative for this time period'),
});

export type GenerateAuraScrollOutput = z.infer<typeof GenerateAuraScrollOutputSchema>;

export async function generateAuraScroll(input: GenerateAuraScrollInput): Promise<GenerateAuraScrollOutput | null> {
  return generateAuraScrollFlow(input);
}

const generateAuraScrollPrompt = ai.definePrompt({
  name: 'generateAuraScrollPrompt',
  input: { schema: GenerateAuraScrollInputSchema },
  config: { temperature: 0.8 },
  template: `
You are an AI artist and narrator specializing in transforming emotional data into beautiful, meaningful aura scrolls.

Transform the following mood and emotion data into a visual aura scroll:

Mood Data: {{moodData}}
Significant Events: {{significantEvents}}
Time Period: {{startDate}} to {{endDate}}

Create weekly aura data that captures the emotional essence of each week:

**Color Mapping Guide:**
- Anxious: #FF4444 (Red)
- Grief/Sadness: #552288 (Deep Purple)
- Reflective/Calm: #3377AA (Blue)
- Renewal/Hope: #33CC88 (Green)
- Joyful/Happy: #FFD700 (Gold)
- Peaceful: #87CEEB (Sky Blue)
- Energetic: #FF6347 (Orange-Red)
- Melancholy: #9370DB (Medium Purple)
- Frustrated: #CD5C5C (Muted Red)
- Neutral: #808080 (Gray)

**Overlay Effects:**
- "crack" (⚡) - Breaking points, sudden changes
- "fog" (🌫️) - Confusion, uncertainty
- "rain" (🌧️) - Sadness, cleansing
- "eclipse" (🌑) - Dark periods, shadow work
- "mirror" (🪞) - Self-reflection, insight
- "drift" (💨) - Feeling lost or floating
- "bloom" (🌸) - Growth, renewal, hope
- "light" (✨) - Breakthrough, clarity
- "storm" (⛈️) - Intense emotional turbulence
- "wave" (🌊) - Emotional floods or flows

For each week:
1. Analyze the dominant mood and emotional tone
2. Select appropriate color based on the mood mapping
3. Choose 1-3 overlays that represent the emotional weather
4. Group consecutive days with similar emotional patterns

Generate narrator quotes that capture emotional transitions with poetic language like:
- "This was your fog season. You moved slowly, but you moved."
- "The grief didn't break you. It soaked in — then bloomed."
- "Spring was not your rescue. It was your rebirth."

Create an overall emotional arc narrative that tells the story of this time period as a journey.

Be specific about weeks, use actual week numbers (e.g., "2024-W15"), and ensure colors and overlays meaningfully represent the emotional data.
`,
});

const generateAuraScrollFlow = ai.defineFlow({
  name: 'generateAuraScrollFlow',
  inputSchema: GenerateAuraScrollInputSchema,
  outputSchema: GenerateAuraScrollOutputSchema,
}, async (input) => {
  const llmResponse = await ai.generate({
    prompt: generateAuraScrollPrompt,
    input,
  });

  return llmResponse.output();
});