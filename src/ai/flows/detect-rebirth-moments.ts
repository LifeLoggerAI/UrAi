'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for rebirth moment detection
export const DetectRebirthMomentsInputSchema = z.object({
  voiceEvents: z.array(z.object({
    text: z.string(),
    emotion: z.string(),
    sentimentScore: z.number(),
    timestamp: z.number(),
  })).describe('Voice events showing emotional evolution'),
  moodData: z.array(z.object({
    emotion: z.string(),
    intensity: z.number(),
    timestamp: z.number(),
  })).describe('Mood tracking data over time'),
  significantEvents: z.array(z.object({
    description: z.string(),
    timestamp: z.number(),
    type: z.string(),
  })).describe('Major life events, crises, or changes'),
  timespan: z.number().describe('Number of days to analyze'),
});

export type DetectRebirthMomentsInput = z.infer<typeof DetectRebirthMomentsInputSchema>;

// Output schema for rebirth moments
export const DetectRebirthMomentsOutputSchema = z.object({
  rebirthMoments: z.array(z.object({
    eventTrigger: z.string().describe('The crisis or trigger that initiated this transformation'),
    symbolicForm: z.string().describe('The type of rebirth (Phoenix Burn, Quiet Bloom, Emotional Wave, etc.)'),
    traitsBefore: z.record(z.number()).describe('Emotional/mental traits before the transformation (0-1 scale)'),
    traitsAfter: z.record(z.number()).describe('Emotional/mental traits after the transformation (0-1 scale)'),
    narratorInsight: z.string().describe('A compassionate reflection on this transformation'),
    linkedLoopsBroken: z.array(z.string()).optional().describe('Names of narrative loops that were broken by this rebirth'),
    bloomUnlocked: z.boolean().describe('Whether this transformation unlocked new potential'),
    transformationScore: z.number().min(0).max(1).describe('How significant this transformation was'),
  })),
});

export type DetectRebirthMomentsOutput = z.infer<typeof DetectRebirthMomentsOutputSchema>;

export async function detectRebirthMoments(input: DetectRebirthMomentsInput): Promise<DetectRebirthMomentsOutput | null> {
  return detectRebirthMomentsFlow(input);
}

const detectRebirthMomentsPrompt = ai.definePrompt({
  name: 'detectRebirthMomentsPrompt',
  input: { schema: DetectRebirthMomentsInputSchema },
  config: { temperature: 0.7 },
  template: `
You are an AI analyst specializing in detecting major inner transformations and rebirth moments in human life journeys.

Analyze the following data to identify significant transformation moments where the user fundamentally changed or rebuilt themselves:

Voice Events: {{voiceEvents}}
Mood Data: {{moodData}}
Significant Events: {{significantEvents}}
Analysis Timespan: {{timespan}} days

Look for these types of rebirth moments:

1. **Phoenix Burn** (🔥) - Total collapse (breakdown, betrayal) followed by transformation
2. **Quiet Bloom** (🌱) - Subtle but permanent growth (boundary set, toxic cycle ended)
3. **Emotional Wave** (🌊) - A flood that cleared out emotional repression
4. **Reconstruction Era** (🛠) - Systematic rebuilding of life post-crisis
5. **Persona Fusion** (🎭) - Integration of past selves into something new

For each rebirth moment:
- Identify the specific trigger event or crisis
- Map emotional/psychological traits before and after (use traits like: confidence, self_respect, emotional_range, social_energy, authenticity, resilience, clarity)
- Provide a compassionate insight about what this transformation means
- Note if any destructive patterns were broken
- Determine if this unlocked new capacities or perspectives

Look for:
- Dramatic sentiment shifts over time
- Language changes in voice events
- Emotional vocabulary expansion
- References to "before/after" thinking
- Mentions of feeling "different" or "new"
- Breaking of old patterns
- New boundaries or behaviors

Use poetic, mythic language that honors the depth of human transformation.
Only identify clear, significant rebirths with evidence in the data.
`,
});

const detectRebirthMomentsFlow = ai.defineFlow({
  name: 'detectRebirthMomentsFlow',
  inputSchema: DetectRebirthMomentsInputSchema,
  outputSchema: DetectRebirthMomentsOutputSchema,
}, async (input) => {
  const llmResponse = await ai.generate({
    prompt: detectRebirthMomentsPrompt,
    input,
  });

  return llmResponse.output();
});