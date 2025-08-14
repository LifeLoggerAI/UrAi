// @ts-nocheck
import { generateStoryboard } from './flows/generate-storyboard';
import type { GenerateStoryboardInput, GenerateStoryboardOutput, StoryScene, StoryShot } from './flows/generate-storyboard'; 

/**
 * Demo runner (not auto-invoked). Keeps types happy during build.
 * Call demoStoryboard() manually from a dev script if you want to test it.
 */
export async function demoStoryboard() {
  const weddingEvent: GenerateStoryboardInput = { eventDescription: 'A heartfelt wedding ceremony at sunset.' };

  const weddingStoryboard = await generateStoryboard({
    eventDescription: weddingEvent.eventDescription
  });

  if (!weddingStoryboard) {
    console.log('No storyboard generated.');
    return;
  }

  console.log('✅ Wedding storyboard generated successfully!');
  console.log(`   Scenes: ${weddingStoryboard.scenes.length}`);

  const firstScene = weddingStoryboard.scenes[0];
  if (firstScene) {
    console.log('\nFirst scene preview:');
    console.log(`   ${firstScene.sceneHeader}`);

    const firstShot = firstScene.shots[0];
    if (firstShot) {
      console.log(`   First shot: ${firstShot.description}`);
    }
  }
}
