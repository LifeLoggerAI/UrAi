'use server';

/**
 * @fileOverview Parses and categorizes raw event data into structured format.
 *
 * - parseEventData - A function that parses raw event descriptions into structured data.
 * - ParseEventInput - The input type for the function.
 * - ParseEventOutput - The return type for the function.
 */

import {ai} from '../genkit';
import {
  ParseEventInputSchema,
  ParseEventOutputSchema,
  type ParseEventInput,
  type ParseEventOutput,
} from '../../lib/types';

export async function parseEventData(input: ParseEventInput): Promise<ParseEventOutput | null> {
  return parseEventDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseEventDataPrompt',
  input: {schema: ParseEventInputSchema},
  output: {schema: ParseEventOutputSchema},
  prompt: `You are an expert event analysis assistant. Your job is to parse raw event data and extract structured information for movie/video storyboard creation.

Raw Event Data:
{{{rawEventData}}}

Extract and organize the following information into a structured format:

**Event Details:**
- Title, date/time, context

**Location:**
- Name, address, environment description (architecture, vegetation, weather, lighting)

**People:** For each person mentioned, extract:
- Identity: name, age, role
- Appearance: height, build, skin tone, hair color and style, eye color, distinguishing features (scars, glasses, facial hair)
- Clothing & accessories: style, colors, textures
- Expression & posture: emotional state, body language

**Actions:** What each person is doing, sequence of key moments

**Props & Objects:** instruments, vehicles, décor, tech, symbolic items

**Mood & Tone:** music style, color palette, camera movement (steady, handheld, drone)

**References:** real-world photos, films, art styles to emulate

If any critical information is missing or unclear, make reasonable assumptions based on context, but flag ambiguous details in your response.`,
});

const parseEventDataFlow = ai.defineFlow(
  {
    name: 'parseEventDataFlow',
    inputSchema: ParseEventInputSchema,
    outputSchema: ParseEventOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output;
  }
);