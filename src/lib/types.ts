
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
    avatarUrl: z.string().optional(),
});
export type Person = z.infer<typeof PersonSchema>;

export const DreamSchema = z.object({
    id: z.string(),
    uid: z.string(),
    text: z.string(),
    createdAt: z.number(),
    emotions: z.array(z.string()),
    themes: z.array(z.string()),
    symbols: z.array(z.string()),
    sentimentScore: z.number(),
});
export type Dream = z.infer<typeof DreamSchema>;


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

export const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

export const GenerateSpeechOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The generated speech as a data URI in WAV format.'),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

export const SummarizeTextInputSchema = z.object({
  text: z.string().describe('A concatenation of text entries to be summarized.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

export const SummarizeTextOutputSchema = z.object({
    summary: z.string().describe("A concise summary of the key themes, moments, and overall mood from the provided text."),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export const AnalyzeDreamInputSchema = z.object({
  text: z.string().describe('The text of a dream entry.'),
});
export type AnalyzeDreamInput = z.infer<typeof AnalyzeDreamInputSchema>;

export const AnalyzeDreamOutputSchema = z.object({
    emotions: z.array(z.string()).describe("A list of primary emotions present in the dream."),
    themes: z.array(z.string()).describe("A list of recurring themes or topics in the dream."),
    symbols: z.array(z.string()).describe("A list of key symbols and their potential meanings within the dream's context."),
    sentimentScore: z.number().describe("A score from -1 (very negative) to 1 (very positive) for the dream's overall tone."),
});
export type AnalyzeDreamOutput = z.infer<typeof AnalyzeDreamOutputSchema>;

export const GenerateAvatarInputSchema = z.object({
  name: z.string().describe('The name of the person for whom to generate an avatar.'),
  role: z.string().describe('The social role associated with the person.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

export const GenerateAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe('The generated avatar image as a data URI.'),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

// Schema for Settings Form
export const UpdateUserSettingsSchema = z.object({
    displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50, "Display name cannot exceed 50 characters."),
    moodTrackingEnabled: z.boolean().default(true),
    passiveAudioEnabled: z.boolean().default(true),
    faceEmotionEnabled: z.boolean().default(false),
    dataExportEnabled: z.boolean().default(true),
});
export type UpdateUserSettings = z.infer<typeof UpdateUserSettingsSchema>;

// Schemas for Dashboard View
export const SentimentDataPointSchema = z.object({
  date: z.string(),
  sentiment: z.number(),
});
export type SentimentDataPoint = z.infer<typeof SentimentDataPointSchema>;

export const EmotionCountSchema = z.object({
  name: z.string(),
  count: z.number(),
});
export type EmotionCount = z.infer<typeof EmotionCountSchema>;

export const DashboardDataSchema = z.object({
  sentimentOverTime: z.array(SentimentDataPointSchema),
  emotionBreakdown: z.array(EmotionCountSchema),
  stats: z.object({
    totalMemories: z.number(),
    totalDreams: z.number(),
    totalPeople: z.number(),
  }),
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;
