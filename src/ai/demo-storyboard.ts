/**
 * Example usage of the storyboard generation system
 * This demonstrates the complete workflow from event description to storyboard
 */

import { generateStoryboard } from './flows/generate-storyboard';
import type { GenerateStoryboardInput, GenerateStoryboardOutput } from '../lib/types';

async function demonstrateStoryboardGeneration() {
  console.log('🎬 Storyboard Generation System Demo\n');

  // Example 1: Wedding ceremony
  const weddingEvent: GenerateStoryboardInput = {
    eventDescription: `
      Event: "Emily and James Wedding Ceremony"
      Date: Saturday, September 14th, 2024, 4:00 PM
      Location: Riverside Gardens Chapel - outdoor venue with white pergola, rose gardens, flowing river backdrop, autumn foliage, natural stone pathway
      
      Weather: Perfect autumn afternoon, 68°F, light breeze, golden sunlight filtering through trees
      
      Key People:
      - Emily (bride, 28): flowing white dress with lace details, auburn hair in elegant updo with white flowers, radiant and emotional
      - James (groom, 30): navy blue suit, white boutonniere, brown hair styled back, nervous but joyful
      - Pastor Williams (officiant, 55): black robes, kind demeanor, holding ceremony book
      - Maid of Honor Sarah (29): dusty rose dress, blonde hair, holding bouquet, emotional
      - Best Man Mike (31): navy suit matching groom, confident stance
      - Family members and friends (50 guests): mix of formal attire, seated in white chairs
      
      Key Moments:
      1. Guests arriving and being seated
      2. Wedding party processional down the stone pathway
      3. Emily's entrance with her father
      4. Exchange of vows under the pergola
      5. Ring exchange ceremony
      6. First kiss as married couple
      7. Recessional with flower petals
      
      Props: White pergola decorated with roses, white folding chairs, stone pathway with rose petals, professional photography equipment, string quartet setup
      
      Mood: Romantic, elegant, natural, warm golden light, classical music, cinematic style like "The Notebook"
    `
  };

  try {
    console.log('Processing wedding ceremony event...');
    const weddingStoryboard = await generateStoryboard(weddingEvent);
    
    if (weddingStoryboard) {
      console.log('✅ Wedding storyboard generated successfully!');
      console.log(`   Scenes: ${weddingStoryboard.scenes.length}`);
      console.log(`   Total shots: ${weddingStoryboard.scenes.reduce((sum, scene) => sum + scene.shots.length, 0)}`);
      console.log('\nFirst scene preview:');
      console.log(`   ${weddingStoryboard.scenes[0].sceneHeader}`);
      console.log(`   First shot: ${weddingStoryboard.scenes[0].shots[0].type} - ${weddingStoryboard.scenes[0].shots[0].subject}`);
    }
  } catch (error) {
    console.error('❌ Error generating wedding storyboard:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Example 2: Corporate presentation
  const corporateEvent: GenerateStoryboardInput = {
    eventDescription: `
      Event: "Q4 Product Launch Presentation"
      Date: Thursday, November 2nd, 2024, 2:00 PM
      Location: Tech Hub Conference Center - modern auditorium with stadium seating, large projection screen, sleek stage with LED backdrop
      
      Key People:
      - Sarah Chen (CEO, 42): professional navy blazer, confident posture, commanding presence
      - Alex Johnson (Product Manager, 35): casual business attire, holding tablet, enthusiastic
      - Audience: 200+ tech professionals, investors, press
      
      Key Moments:
      1. Audience settling in, anticipation building
      2. Sarah's opening remarks from podium
      3. Product demo with large screen visuals
      4. Alex presenting technical features
      5. Q&A session with audience engagement
      6. Closing remarks and networking begins
      
      Tech: Large LED screen, wireless microphones, professional lighting rig, multiple cameras for live streaming
      
      Mood: Professional, innovative, high-energy, modern corporate aesthetic, dynamic lighting
    `
  };

  try {
    console.log('Processing corporate presentation event...');
    const corporateStoryboard = await generateStoryboard(corporateEvent);
    
    if (corporateStoryboard) {
      console.log('✅ Corporate storyboard generated successfully!');
      console.log(`   Scenes: ${corporateStoryboard.scenes.length}`);
      console.log(`   Total shots: ${corporateStoryboard.scenes.reduce((sum, scene) => sum + scene.shots.length, 0)}`);
    }
  } catch (error) {
    console.error('❌ Error generating corporate storyboard:', error);
  }

  console.log('\n🎉 Demo completed successfully!');
}

// Example of how to integrate with an image generation API
async function generateImagesForStoryboard(storyboard: GenerateStoryboardOutput): Promise<string[]> {
  const imageUrls: string[] = [];
  
  for (const scene of storyboard.scenes) {
    console.log(`\nGenerating images for: ${scene.sceneHeader}`);
    
    for (const shot of scene.shots) {
      // This is where you would call your preferred image generation API
      console.log(`Image prompt: ${shot.imagePrompt.substring(0, 100)}...`);
      
      // Simulated API call
      const imageUrl = `https://generated-image-api.com/image-${Date.now()}-${Math.random()}.jpg`;
      imageUrls.push(imageUrl);
      
      console.log(`Generated: ${imageUrl}`);
    }
  }
  
  return imageUrls;
}

// Example of converting to video production format
function convertToVideoProductionFormat(storyboard: GenerateStoryboardOutput) {
  return {
    projectTitle: "Generated Storyboard",
    totalScenes: storyboard.scenes.length,
    scenes: storyboard.scenes.map((scene, sceneIndex) => ({
      sceneNumber: sceneIndex + 1,
      location: scene.sceneHeader.split(':')[1]?.trim() || 'Unknown Location',
      timeOfDay: scene.sceneHeader.split(',')[1]?.trim() || 'Unknown Time',
      dialogue: scene.dialogue || 'No dialogue',
      shots: scene.shots.map((shot, shotIndex) => ({
        shotNumber: shotIndex + 1,
        shotType: shot.type,
        subject: shot.subject,
        action: shot.action,
        cameraInstructions: shot.camera,
        lightingNotes: shot.lighting,
        imageReference: shot.imagePrompt,
        estimatedDuration: '3-5 seconds' // You could make this more sophisticated
      }))
    }))
  };
}

export { 
  demonstrateStoryboardGeneration, 
  generateImagesForStoryboard, 
  convertToVideoProductionFormat 
};

// Run demo if this file is executed directly
if (require.main === module) {
  demonstrateStoryboardGeneration();
}