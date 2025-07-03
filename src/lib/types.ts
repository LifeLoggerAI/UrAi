import { z } from "zod";

// Base sentiment type
export type Sentiment = "positive" | "negative" | "neutral";

// Type for the old note structure, potentially used in trends-summary
export interface Note {
  id: string;
  content: string;
  timestamp: number;
  sentiment: Sentiment;
}

// Combined type for client-side state management
export interface AppData {
    voiceEvent: VoiceEvent;
    transcription: Transcription;
    emotionState: EmotionState;
}

// From Firestore Data Model
export interface User {
    profile: {
        name: string;
        email: string;
        avatarUrl: string;
        joinDate: number; // timestamp
        veteranStatus: boolean;
        proTier: boolean;
    };
    permissions: {
        mic: boolean;
        location: boolean;
        camera: boolean;
        notifications: boolean;
        calendar: boolean;
        photos: boolean;
    };
    narratorPrefs: {
        toneStyle: string;
        metaphorLexicon: string[];
        ttsConfig: {
            pitch: number;
            speed: number;
        };
    };
}

export interface Device {
    platform: 'ios' | 'android' | 'web';
    model: string;
    pushToken: string;
    lastActive: number; // timestamp
}

export interface Subscription {
    tier: 'free' | 'pro';
    status: 'active' | 'canceled' | 'past_due';
    startDate: number; // timestamp
    renewDate: number; // timestamp
}

export interface VoiceEvent {
    id: string;
    userId: string;
    timestamp: number;
    rawAudioRef: string; // GCS path
    transcriptRef: string; // Firestore path
    speakerId?: string;
    detectedEmotions: string[];
    toneScore: number;
    taskIntent?: string;
    voiceMemoryStrength: number; // 0-100
    socialArchetype: string;
    emotionalEchoScore: number; // -100 to 100
}

export interface Transcription {
    id: string;
    voiceEventId: string;
    userId: string;
    fullText: string;
    summary: string;
    tags: string[];
    people: string[];
    tasks: string[];
    sentiment: Sentiment;
}

export interface Person {
    id: string;
    userId: string;
    displayName: string;
    voiceprintRef: string; // GCS path
    firstDetected: number; // timestamp
    lastSeen: number; // timestamp
    socialRoleHistory: { date: number; role: string }[];
    familiarityIndex: number; // 0-100
    silenceDeltaDays: number;
    avatarUrl?: string;
}

export interface EmotionState {
    id: string;
    userId: string;
    timestamp: number;
    model: string;
    dominantEmotion: string;
    blendVector: Record<string, number>; // e.g., { joy: 0.8, sad: 0.1, ... }
    confidence: number;
    source: 'voice' | 'image' | 'ambient' | 'fusion';
}

// Schemas for Genkit Flows

export const ProcessVoiceEventInputSchema = z.object({
  transcript: z.string().describe('The full text transcript from a voice recording.'),
});
export type ProcessVoiceEventInput = z.infer<typeof ProcessVoiceEventInputSchema>;

export const ProcessVoiceEventOutputSchema = z.object({
    summary: z.string().describe("A one-sentence summary of the transcript."),
    tags: z.array(z.string()).describe("A list of relevant tags or keywords."),
    people: z.array(z.string()).describe("A list of names of people mentioned."),
    tasks: z.array(z.string()).describe("A list of actionable tasks or to-do items mentioned."),
    detectedEmotions: z.array(z.string()).describe("A list of primary emotions detected in the text."),
    toneScore: z.number().describe("A score from -1 (negative) to 1 (positive) representing the overall tone."),
    socialArchetype: z.string().describe("The social archetype displayed (e.g., 'Mentor', 'Friend', 'Reporter')."),
    emotionalEchoScore: z.number().describe("A score from -100 to 100 indicating the emotional resonance or impact."),
});
export type ProcessVoiceEventOutput = z.infer<typeof ProcessVoiceEventOutputSchema>;

export const SummarizeTrendsInputSchema = z.object({
  notes: z.array(z.string()).describe('An array of text notes to summarize.'),
});
export type SummarizeTrendsInput = z.infer<typeof SummarizeTrendsInputSchema>;

export const SummarizeTrendsOutputSchema = z.object({
  summary: z.string().describe('A summary of the trends and themes found in the notes.'),
});
export type SummarizeTrendsOutput = z.infer<typeof SummarizeTrendsOutputSchema>;
