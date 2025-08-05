/**
 * Example implementation showing how to integrate SSML voice synthesis
 * into the generate-speech AI flow
 */

import { generateSSML, generateConversationalSSML, generateEmotionalSSML } from '@/lib/audio/ssml';

// Example of updating generate-speech flow to use SSML
export function enhanceTextWithSSML(
  text: string,
  context: {
    type?: 'greeting' | 'question' | 'response' | 'farewell';
    emotion?: 'calm' | 'excited' | 'empathetic' | 'professional';
    customOptions?: {
      voice?: string;
      rate?: number;
      pitch?: string;
    };
  } = {}
): string {
  const { type, emotion, customOptions } = context;

  // Use conversational context if specified
  if (type) {
    return generateConversationalSSML(text, type);
  }

  // Use emotional context if specified
  if (emotion) {
    return generateEmotionalSSML(text, emotion);
  }

  // Use custom options if provided
  if (customOptions) {
    return generateSSML(text, customOptions);
  }

  // Default SSML generation
  return generateSSML(text);
}

// Example usage in different scenarios
export const voiceExamples = {
  // Welcome message with excited tone
  welcome: enhanceTextWithSSML(
    "Welcome to UrAI! I'm here to help you on your journey of self-discovery.",
    { type: 'greeting', emotion: 'excited' }
  ),

  // Asking about user's day with empathetic tone
  checkIn: enhanceTextWithSSML(
    "How are you feeling today? I'm here to listen and understand.",
    { type: 'question', emotion: 'empathetic' }
  ),

  // Providing insight with calm, professional tone
  insight: enhanceTextWithSSML(
    "Based on your recent entries, I notice a pattern of growth and resilience. This suggests you're developing stronger coping mechanisms.",
    { type: 'response', emotion: 'professional' }
  ),

  // Farewell with warm tone
  goodbye: enhanceTextWithSSML(
    "Thank you for sharing with me today. Remember, I'm always here when you need support.",
    { type: 'farewell', emotion: 'empathetic' }
  ),

  // Custom voice settings for specific use case
  meditation: enhanceTextWithSSML(
    "Take a deep breath in... and slowly release. Feel the tension leaving your body with each exhale.",
    {
      customOptions: {
        voice: 'en-US-AmberNeural',
        rate: 0.8,
        pitch: '-2st',
      },
    }
  ),

  // Celebration message with high energy
  achievement: enhanceTextWithSSML(
    "Congratulations! You've completed your goal. This is a wonderful achievement worth celebrating!",
    { emotion: 'excited' }
  ),
};

// Function to be called from AI flows
export function generateVoiceResponse(
  text: string,
  userContext?: {
    mood?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    isFirstTime?: boolean;
    conversationType?: 'journal' | 'chat' | 'meditation' | 'reflection';
  }
): string {
  if (!userContext) {
    return generateSSML(text);
  }

  const { mood, timeOfDay, isFirstTime, conversationType } = userContext;

  // Determine appropriate voice characteristics based on context
  if (isFirstTime) {
    return enhanceTextWithSSML(text, { type: 'greeting', emotion: 'professional' });
  }

  if (conversationType === 'meditation') {
    return enhanceTextWithSSML(text, {
      customOptions: {
        voice: 'en-US-AmberNeural',
        rate: 0.8,
        pitch: '-1st',
      },
    });
  }

  if (mood === 'sad' || mood === 'anxious') {
    return enhanceTextWithSSML(text, { emotion: 'empathetic' });
  }

  if (mood === 'happy' || mood === 'excited') {
    return enhanceTextWithSSML(text, { emotion: 'excited' });
  }

  // Time-based voice adjustments
  if (timeOfDay === 'morning') {
    return enhanceTextWithSSML(text, { type: 'greeting' });
  }

  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    return enhanceTextWithSSML(text, { emotion: 'calm' });
  }

  // Default professional response
  return enhanceTextWithSSML(text, { emotion: 'professional' });
}

// Integration helper for existing TTS functions
export function wrapTTSCall(originalTTSFunction: (text: string) => Promise<any>) {
  return async (text: string, context?: any) => {
    // Generate SSML-enhanced text
    const enhancedText = generateVoiceResponse(text, context);
    
    // Call original TTS function with enhanced text
    return originalTTSFunction(enhancedText);
  };
}