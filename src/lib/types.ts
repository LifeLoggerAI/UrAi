import { z } from "zod";

// Base sentiment type
export type Sentiment = "positive" | "negative" | "neutral";

// From Blueprint Data Model
export const UserSchema = z.object({
    uid: z.string(),
    displayName: z.string().optional(),
    email: z.string().email().optional(),
    createdAt: z.number(),
    avatarUrl: z.string().url().optional(),
    personaProfile: z.record(z.any()).optional(),
    symbolLexicon: z.record(z.any()).optional(),
    subscriptionTier: z.string().optional(),
    settings: z.object({
        moodTrackingEnabled: z.boolean().default(true),
        passiveAudioEnabled: z.boolean().default(true),
        faceEmotionEnabled: z.boolean().default(false),
        dataExportEnabled: z.boolean().default(true),
    }).optional(),
});
export type User = z.infer<typeof UserSchema>;

export const AudioEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    storagePath: z.string(),
    startTs: z.number(),
    endTs: z.number(),
    durationSec: z.number(),
    voicePrintHashes: z.array(z.string()).optional(),
    transcriptionStatus: z.enum(["pending", "complete", "error"]),
    conversationId: z.string().optional(),
});
export type AudioEvent = z.infer<typeof AudioEventSchema>;

export const VoiceEventSchema = z.object({
    id: z.string(),
    uid: z.string(),
    audioEventId: z.string(),
    speakerLabel: z.string(),
    text: z.string(),
    emotion: z.string(),
    sentimentScore: z.number(),
    toneShift: z.number(),
    voiceArchetype: z.string(),
    createdAt: z.number(),
    people: z.array(z.string()).optional(),
    tasks: z.array(z.string()).optional(),
});
export type VoiceEvent = z.infer<typeof VoiceEventSchema>;

export const PersonSchema = z.object({
    id: z.string(),
    uid: z.string(),
    name: z.string(),
    lastSeen: z.number(),
    familiarityIndex: z.number(),
    socialRoleHistory: z.array(z.object({
        date: z.number(),
        role: z.string(),
    })),
    avatarUrl: z.string().url().optional(),
});
export type Person = z.infer<typeof PersonSchema>;


// Schemas for Genkit Flows

export const EnrichVoiceEventInputSchema = z.object({
  text: z.string().describe('The full text transcript from a voice recording.'),
});
export type EnrichVoiceEventInput = z.infer<typeof EnrichVoiceEventInputSchema>;

export const EnrichVoiceEventOutputSchema = z.object({
    emotion: z.string().describe("The primary emotion detected in the text."),
    sentimentScore: z.number().describe("A score from -1 (negative) to 1 (positive) representing the overall tone."),
    toneShift: z.number().describe("A score representing the change in tone within the text."),
    voiceArchetype: z.string().describe("The social archetype displayed (e.g., 'Mentor', 'Friend', 'Reporter')."),
    people: z.array(z.string()).describe("A list of names of people mentioned in the transcript."),
    tasks: z.array(z.string()).describe("A list of actionable tasks or to-do items mentioned in the transcript."),
});
export type EnrichVoiceEventOutput = z.infer<typeof EnrichVoiceEventOutputSchema>;


export const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

export const TranscribeAudioOutputSchema = z.object({
    transcript: z.string().describe("The transcribed text from the audio."),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;
