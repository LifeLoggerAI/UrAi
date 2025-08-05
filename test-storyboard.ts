#!/usr/bin/env tsx

/**
 * Test script for the event-to-storyboard functionality
 * This demonstrates how to use the new AI flows to transform event data into storyboards
 */

import { eventToStoryboard } from '../src/ai/flows/event-to-storyboard';
import type { EventToStoryboardInput } from '../src/lib/types';

// Sample event data for testing
const sampleEventData: EventToStoryboardInput = {
  rawEventData: `
  Event: Maria's Birthday Celebration
  Date: Saturday, December 2nd, 2023
  Time: 7:00 PM
  Location: Rosewood Garden Restaurant, downtown
  
  Context: Maria is celebrating her 35th birthday with close friends and family in an intimate garden restaurant setting.
  
  People:
  - Maria Delgado (35, birthday celebrant): Latina woman, about 5'6", olive skin, long wavy dark brown hair, warm brown eyes, wearing a flowing emerald green dress and silver jewelry, radiant smile
  - James Chen (38, Maria's partner): Asian man, 5'10", athletic build, black hair in modern cut, dark brown eyes, wearing navy blue button-down shirt and khakis, gentle expression
  - Sarah Williams (33, best friend): African American woman, 5'4", curvy build, short natural hair, bright smile, wearing purple blouse and black pants
  - Roberto Delgado (62, Maria's father): Older Latino man, graying hair, mustache, wearing white guayabera shirt, proud expression
  
  Actions:
  1. Guests arriving and greeting Maria
  2. Maria blowing out candles on birthday cake
  3. Group toasting with wine glasses
  4. Dancing to mariachi music
  5. Maria opening presents
  
  Location Details:
  - Outdoor garden restaurant with string lights
  - Stone fountain in center
  - Lush greenery and flowering plants
  - Warm golden evening lighting
  - Cobblestone pathways
  
  Props: Birthday cake with candles, wine glasses, wrapped presents, mariachi band instruments, string lights
  
  Mood: Joyful, warm, celebratory, intimate
  Color Palette: Warm golds, deep greens, soft purples
  Camera Style: Handheld for intimacy, some steady shots for formal moments
  Music: Mariachi, acoustic guitar
  `
};

async function testStoryboardGeneration() {
  try {
    console.log('🎬 Testing Event-to-Storyboard AI Flow');
    console.log('=====================================\n');
    
    console.log('Input Event Data:');
    console.log(sampleEventData.rawEventData);
    console.log('\n🤖 Processing with AI flows...\n');
    
    const result = await eventToStoryboard(sampleEventData);
    
    if (result) {
      console.log('✅ Successfully generated storyboard!\n');
      
      console.log(`📽️  Generated ${result.scenes.length} scene(s):\n`);
      
      result.scenes.forEach((scene, sceneIndex) => {
        console.log(`Scene ${sceneIndex + 1}: ${scene.sceneHeader}`);
        console.log(`  📸 ${scene.shots.length} shot(s):`);
        
        scene.shots.forEach((shot, shotIndex) => {
          console.log(`    Shot ${shotIndex + 1}: ${shot.type} - ${shot.subject}`);
          console.log(`      Action: ${shot.action}`);
          console.log(`      Camera: ${shot.camera}`);
          console.log(`      Lighting: ${shot.lighting}`);
          console.log(`      Image Prompt: ${shot.imagePrompt.substring(0, 100)}...`);
          console.log('');
        });
        
        if (scene.dialogue) {
          console.log(`    💬 Dialogue: ${scene.dialogue}`);
        }
        console.log('\n');
      });
      
      if (result.missingDetails && result.missingDetails.length > 0) {
        console.log('⚠️  Missing Details Flagged:');
        result.missingDetails.forEach(detail => {
          console.log(`  - ${detail}`);
        });
        console.log('\n');
      }
      
      console.log('🎉 Test completed successfully!');
      
    } else {
      console.error('❌ Failed to generate storyboard');
    }
    
  } catch (error) {
    console.error('❌ Error during storyboard generation:', error);
  }
}

// Only run the test if this file is executed directly
if (require.main === module) {
  testStoryboardGeneration();
}

export { testStoryboardGeneration };