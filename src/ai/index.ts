/**
 * Main exports for AI flows
 * Convenient access to all AI-powered features
 */

// Export all existing flows
export { companionChat } from './flows/companion-chat';
export { analyzeCameraImage } from './flows/analyze-camera-image';
export { analyzeDream } from './flows/analyze-dream';
export { analyzeTextSentiment } from './flows/analyze-text-sentiment';
export { enrichVoiceEvent } from './flows/enrich-voice-event';
export { generateAvatar } from './flows/generate-avatar';
export { generateSpeech } from './flows/generate-speech';
export { generateSymbolicInsight } from './flows/generate-symbolic-insight';
export { processOnboardingTranscript } from './flows/process-onboarding-transcript';
export { suggestRitual } from './flows/suggest-ritual';
export { summarizeText } from './flows/summarize-text';
export { transcribeAudio } from './flows/transcribe-audio';

// Export the new storyboard generation flow
export { generateStoryboard } from './flows/generate-storyboard';

// Export types for convenience
export type {
  GenerateStoryboardInput,
  GenerateStoryboardOutput,
  StoryboardOutput,
  SceneData,
  ShotData,
  EventData,
  LocationData,
  PersonData,
  ActionData,
  PropObject,
  MoodTone,
  ReferenceData
} from '../lib/types';