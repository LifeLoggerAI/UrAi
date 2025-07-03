import { config } from 'dotenv';
config();

import '@/ai/flows/enrich-voice-event.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/summarize-text.ts';
import '@/ai/flows/generate-speech.ts';
