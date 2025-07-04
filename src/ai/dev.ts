
import { config } from 'dotenv';
config();

import '@/ai/flows/enrich-voice-event.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/summarize-text.ts';
import '@/ai/flows/generate-speech.ts';
import '@/ai/flows/analyze-dream.ts';
import '@/ai/flows/generate-avatar.ts';
import '@/ai/flows/companion-chat.ts';
import '@/ai/flows/analyze-face.ts';
import '@/ai/flows/analyze-text-sentiment.ts';
import '@/ai/flows/suggest-ritual.ts';
import '@/ai/flows/process-onboarding-transcript.ts';
