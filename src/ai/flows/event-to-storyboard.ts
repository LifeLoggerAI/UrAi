'use server';

/**
 * @fileOverview Main orchestration flow for transforming event data into storyboards.
 *
 * - eventToStoryboard - Main function that orchestrates the complete transformation.
 * - EventToStoryboardInput - The input type for the function.
 * - EventToStoryboardOutput - The return type for the function.
 */

import {ai} from '../genkit';
import {
  EventToStoryboardInputSchema,
  EventToStoryboardOutputSchema,
  type EventToStoryboardInput,
  type EventToStoryboardOutput,
  type ParseEventInput,
  type EventInput,
  type GenerateSceneBreakdownInput,
  type GenerateImagePromptsInput,
} from '../../lib/types';
import {parseEventData} from './parse-event-data';
import {generateSceneBreakdown} from './generate-scene-breakdown';
import {generateImagePrompts} from './generate-image-prompts';

export async function eventToStoryboard(input: EventToStoryboardInput): Promise<EventToStoryboardOutput | null> {
  return eventToStoryboardFlow(input);
}

/**
 * Validates the structured event data and identifies missing details
 */
function validateEventData(eventData: EventInput): string[] {
  const missingDetails: string[] = [];

  // Check for missing people details
  eventData.people?.forEach((person, index) => {
    if (!person.eyeColor) {
      missingDetails.push(`Missing eye color for ${person.name || `Person ${index + 1}`}—please provide to ensure likeness.`);
    }
    if (!person.hairColor) {
      missingDetails.push(`Missing hair color for ${person.name || `Person ${index + 1}`}—please provide to ensure likeness.`);
    }
    if (!person.skinTone) {
      missingDetails.push(`Missing skin tone for ${person.name || `Person ${index + 1}`}—please provide to ensure likeness.`);
    }
    if (!person.clothing) {
      missingDetails.push(`Missing clothing description for ${person.name || `Person ${index + 1}`}—please provide for visual consistency.`);
    }
  });

  // Check for missing location details
  if (!eventData.location.lighting) {
    missingDetails.push("Missing lighting conditions for location—please provide for cinematic accuracy.");
  }
  if (!eventData.location.timeOfDay) {
    missingDetails.push("Missing time of day—please provide for proper lighting and mood setup.");
  }

  // Check for missing mood/tone details
  if (!eventData.mood) {
    missingDetails.push("Missing overall mood description—please provide for consistent tone across scenes.");
  }

  return missingDetails;
}

const eventToStoryboardFlow = ai.defineFlow(
  {
    name: 'eventToStoryboardFlow',
    inputSchema: EventToStoryboardInputSchema,
    outputSchema: EventToStoryboardOutputSchema,
  },
  async (input) => {
    try {
      // Step 1: Parse & categorize input
      console.log('Step 1: Parsing raw event data...');
      const parseInput: ParseEventInput = {
        rawEventData: input.rawEventData,
      };
      
      const parsedEventData = await parseEventData(parseInput);
      if (!parsedEventData) {
        throw new Error('Failed to parse event data');
      }

      // Step 2: Validate and identify missing details
      console.log('Step 2: Validating event data...');
      const missingDetails = validateEventData(parsedEventData);

      // Step 3: Generate scene breakdown
      console.log('Step 3: Generating scene breakdown...');
      const sceneInput: GenerateSceneBreakdownInput = {
        eventData: parsedEventData,
      };
      
      const sceneBreakdown = await generateSceneBreakdown(sceneInput);
      if (!sceneBreakdown) {
        throw new Error('Failed to generate scene breakdown');
      }

      // Step 4: Create ultra-photo-realistic image prompts
      console.log('Step 4: Generating image prompts...');
      const imagePromptsInput: GenerateImagePromptsInput = {
        eventData: parsedEventData,
        sceneBreakdown: sceneBreakdown,
      };
      
      const imagePromptsResult = await generateImagePrompts(imagePromptsInput);
      if (!imagePromptsResult) {
        throw new Error('Failed to generate image prompts');
      }

      // Step 5: Cross-reference & validation
      console.log('Step 5: Cross-referencing and validating final output...');
      
      // Ensure all shots have complete image prompts
      const scenesWithValidation = imagePromptsResult.scenes.map(scene => {
        const validatedShots = scene.shots.map(shot => {
          // Verify image prompt contains key elements
          const prompt = shot.imagePrompt;
          const hasPersonDetails = parsedEventData.people?.some(person => 
            prompt.includes(person.name || '') || 
            (person.eyeColor && prompt.includes(person.eyeColor)) ||
            (person.hairColor && prompt.includes(person.hairColor))
          );
          
          if (!hasPersonDetails && parsedEventData.people && parsedEventData.people.length > 0) {
            missingDetails.push(`Image prompt for shot "${shot.action}" may be missing specific person appearance details.`);
          }
          
          return shot;
        });
        
        return {
          ...scene,
          shots: validatedShots,
        };
      });

      // Step 6: Output final JSON
      const result: EventToStoryboardOutput = {
        scenes: scenesWithValidation,
        missingDetails: missingDetails.length > 0 ? missingDetails : undefined,
      };

      console.log('Successfully generated storyboard with', result.scenes.length, 'scenes');
      if (missingDetails.length > 0) {
        console.log('Warning: Found', missingDetails.length, 'missing details that may affect quality');
      }

      return result;
      
    } catch (error) {
      console.error('Error in eventToStoryboard flow:', error);
      throw error;
    }
  }
);