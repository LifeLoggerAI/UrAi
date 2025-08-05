/**
 * @fileOverview Practical usage examples for enhanced TTS with SSML
 * 
 * This file provides ready-to-use examples for implementing natural TTS
 * in the UrAi application with different scenarios and moods.
 */

import type { GenerateSpeechInput } from '@/lib/types';

/**
 * Pre-configured TTS settings for different application contexts
 */
export const TTS_PRESETS = {
  // Calm, meditative voice for mindfulness content
  mindfulness: {
    useSSML: true,
    voiceName: "en-US-Wavenet-F",
    rate: 0.85,
    pitch: "+0.5st",
    enableEmphasis: true,
    addNaturalPauses: true
  },

  // Warm, supportive voice for emotional support
  supportive: {
    useSSML: true,
    voiceName: "en-US-Wavenet-C",
    rate: 0.9,
    pitch: "+1st",
    enableEmphasis: true,
    addNaturalPauses: true
  },

  // Clear, informative voice for insights and analysis
  informative: {
    useSSML: true,
    voiceName: "en-US-Wavenet-D",
    rate: 0.95,
    pitch: "+0.5st",
    enableEmphasis: true,
    addNaturalPauses: true
  },

  // Gentle, encouraging voice for ritual guidance
  encouraging: {
    useSSML: true,
    voiceName: "en-US-Wavenet-E",
    rate: 0.88,
    pitch: "+1.5st",
    enableEmphasis: true,
    addNaturalPauses: true
  }
} as const;

/**
 * Helper function to create TTS input with a preset
 * @param text - The text to convert to speech
 * @param preset - The preset configuration to use
 * @returns Configured GenerateSpeechInput
 */
export function createTTSInput(
  text: string, 
  preset: keyof typeof TTS_PRESETS = 'informative'
): GenerateSpeechInput {
  return {
    text,
    ...TTS_PRESETS[preset]
  };
}

/**
 * Usage examples for different scenarios in the UrAi app
 */
export const USAGE_EXAMPLES = {
  // Daily insight narration
  dailyInsight: () => createTTSInput(
    "Good morning. Your energy today feels focused and determined. I sense you're ready to tackle important challenges. Remember to pause and breathe when things feel overwhelming.",
    'supportive'
  ),

  // Ritual guidance
  ritualGuidance: () => createTTSInput(
    "Let's begin this grounding ritual. Find a comfortable position and close your eyes. Take three deep breaths, feeling your connection to the present moment.",
    'mindfulness'
  ),

  // Dream analysis
  dreamAnalysis: () => createTTSInput(
    "Your dream reveals important themes of transformation and growth. The recurring symbol of water suggests emotional cleansing and renewal. This is a powerful message from your subconscious.",
    'informative'
  ),

  // Mood reflection
  moodReflection: () => createTTSInput(
    "I notice your mood has shifted throughout the day. These emotional waves are completely natural. You're processing experiences and growing stronger through each feeling.",
    'supportive'
  ),

  // Achievement celebration
  achievementCelebration: () => createTTSInput(
    "Congratulations! You've made incredible progress on your personal growth journey. Take a moment to appreciate how far you've come. You should feel proud of this achievement.",
    'encouraging'
  ),

  // Mindfulness prompt
  mindfulnessPrompt: () => createTTSInput(
    "Take this moment to center yourself. Notice your breath, your heartbeat, the space around you. You are exactly where you need to be right now.",
    'mindfulness'
  )
};

/**
 * Quick function to generate speech for common app scenarios
 * @param scenario - The scenario type
 * @param customText - Optional custom text to override the example
 * @returns Promise<GenerateSpeechOutput | null>
 */
export async function generateScenarioSpeech(
  scenario: keyof typeof USAGE_EXAMPLES,
  customText?: string
): Promise<any> {
  // This would be imported from the actual flow in real usage
  // import { generateSpeech } from '@/ai/flows/generate-speech';
  
  const input = USAGE_EXAMPLES[scenario]();
  if (customText) {
    input.text = customText;
  }
  
  // return await generateSpeech(input);
  console.log('Would generate speech with input:', input);
  return { audioDataUri: 'mock_data_uri' };
}

/**
 * Helper to create custom SSML for specific emotional tones
 */
export function createEmotionalTTS(
  text: string,
  emotion: 'calm' | 'energetic' | 'gentle' | 'confident'
): GenerateSpeechInput {
  const emotionConfigs = {
    calm: { rate: 0.85, pitch: "+0.5st", voiceName: "en-US-Wavenet-F" },
    energetic: { rate: 1.05, pitch: "+1.5st", voiceName: "en-US-Wavenet-H" },
    gentle: { rate: 0.9, pitch: "+1st", voiceName: "en-US-Wavenet-C" },
    confident: { rate: 0.95, pitch: "+0.5st", voiceName: "en-US-Wavenet-D" }
  };

  return {
    text,
    useSSML: true,
    enableEmphasis: true,
    addNaturalPauses: true,
    ...emotionConfigs[emotion]
  };
}