import { config } from 'dotenv';
config();

import '@/ai/flows/enrich-voice-event';
import '@/ai/flows/transcribe-audio';
import '@/ai/flows/summarize-text';
import '@/ai/flows/generate-speech';
import '@/ai/flows/analyze-dream';
import '@/ai/flows/companion-chat';
import '@/ai/flows/analyze-camera-image';
import '@/ai/flows/generate-symbolic-insight';
import '@/ai/flows/analyze-text-sentiment';
import '@/ai/flows/suggest-ritual';
import '@/ai/flows/process-onboarding-transcript';
import '@/ai/flows/generate-avatar';

// Initialize the Genkit AI configuration.
// Simply importing './genkit' is enough to trigger its configuration.
import './genkit';
