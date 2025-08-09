// Core type definitions for UrAi application
import { z } from 'zod';

// Base types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  name: string;
  relationship?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Updated Dream type for constellation mapping
export interface Dream {
  id?: string;
  userId: string;
  title?: string;
  content?: string;
  symbols: string[];
  emotions: string[];
  location?: string;
  linkedPersona?: string;
  dreamQualityScore?: number;
  themes?: string[];
  sentimentScore?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface VoiceEvent {
  id: string;
  userId: string;
  transcript: string;
  audioUrl?: string;
  sentiment?: number;
  emotion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AudioEvent {
  id: string;
  userId: string;
  audioUrl: string;
  transcript?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  goalId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryBloom {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'memory' | 'reflection' | 'insight';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InnerVoiceReflection {
  id: string;
  userId: string;
  content: string;
  emotion?: string;
  intensity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyScroll {
  id: string;
  userId: string;
  week: string;
  content: string;
  themes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Companion {
  id: string;
  userId: string;
  name: string;
  personality: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaProfile {
  id: string;
  userId: string;
  archetype: string;
  traits: string[];
  strengths: string[];
  growthAreas: string[];
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuraState {
  id: string;
  userId: string;
  energy: number;
  mood: string;
  focus: number;
  vitality: number;
  timestamp: string;
}

// AI Flow Schemas
export const AnalyzeDreamInputSchema = z.object({
  text: z.string().describe('The dream content to analyze'),
});

export const AnalyzeDreamOutputSchema = z.object({
  emotions: z.array(z.string()).describe('Primary emotions in the dream'),
  themes: z.array(z.string()).describe('Major themes or subjects'),
  symbols: z.array(z.object({
    symbol: z.string(),
    interpretation: z.string(),
  })).describe('Key symbols and their interpretations'),
  sentimentScore: z.number().min(-1).max(1).describe('Overall sentiment score'),
});

export const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('Text to convert to speech'),
  voice: z.string().optional().describe('Voice to use for speech'),
  emotion: z.string().optional().describe('Emotional tone'),
});

export const GenerateSpeechOutputSchema = z.object({
  audioUrl: z.string().describe('URL to the generated audio file'),
  ssml: z.string().optional().describe('SSML markup used'),
});

export const TranscribeAudioInputSchema = z.object({
  audioUrl: z.string().describe('URL to the audio file to transcribe'),
});

export const TranscribeAudioOutputSchema = z.object({
  transcript: z.string().describe('Transcribed text'),
  confidence: z.number().optional().describe('Confidence score'),
});

export const CompanionChatInputSchema = z.object({
  message: z.string().describe('User message to the companion'),
  context: z.string().optional().describe('Additional context for the conversation'),
});

export const CompanionChatOutputSchema = z.object({
  response: z.string().describe('Companion response'),
  emotion: z.string().optional().describe('Emotional tone of response'),
});

export const UpdateUserSettingsSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  // Add other user settings as needed
});

export const AnalyzeCameraImageInputSchema = z.object({
  imageUrl: z.string().url().describe('URL of the image to analyze'),
});

export const AnalyzeCameraImageOutputSchema = z.object({
  labels: z.array(z.string()).describe('Labels detected in the image'),
  // Add other image analysis outputs as needed
});

export const EnrichVoiceEventInputSchema = z.object({
  transcript: z.string().describe('The transcribed text of the voice event'),
  // Add other relevant input fields for enrichment
});

export const EnrichVoiceEventOutputSchema = z.object({
  sentiment: z.number().describe('Sentiment score of the voice event'),
  keywords: z.array(z.string()).describe('Keywords extracted from the voice event'),
  // Add other enriched data
});

export const GenerateAvatarInputSchema = z.object({
  description: z.string().describe('Description of the avatar to generate'),
  // Add other relevant input fields for avatar generation
});

export const GenerateAvatarOutputSchema = z.object({
  avatarUrl: z.string().url().describe('URL of the generated avatar image'),
});

export const GenerateSymbolicInsightInputSchema = z.object({
  context: z.string().describe('Context for generating symbolic insight (e.g., dream, reflection)'),
});

export const GenerateSymbolicInsightOutputSchema = z.object({
  insight: z.string().describe('Generated symbolic insight'),
  symbols: z.array(z.string()).describe('Symbols identified in the insight'),
});

export const ProcessOnboardingTranscriptInputSchema = z.object({
  transcript: z.string().describe('The transcribed text from the onboarding process'),
});

export const ProcessOnboardingTranscriptOutputSchema = z.object({
  summary: z.string().describe('Summary of the onboarding transcript'),
  // Add other relevant processed data
});

export const SuggestRitualInputSchema = z.object({
  mood: z.string().describe('Current mood or emotional state'),
  goal: z.string().optional().describe('Optional goal for the ritual'),
});

export const SuggestRitualOutputSchema = z.object({
  ritualName: z.string().describe('Name of the suggested ritual'),
  description: z.string().describe('Description of the ritual steps'),
});

export const SummarizeTextInputSchema = z.object({
  text: z.string().describe('Text content to summarize'),
  maxLength: z.number().optional().describe('Maximum length of the summary'),
});

export const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('Summarized text content'),
});

export const DashboardDataSchema = z.object({
  totalNotes: z.number(),
  recentDreams: z.array(z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
  })),
  // Add other dashboard data as needed
});

export const MoodLogSchema = z.object({
  mood: z.string(),
  intensity: z.number().min(1).max(10),
  notes: z.string().optional(),
  timestamp: z.string(),
});

export const AuraStateSchema = z.object({
  energy: z.number(),
  mood: z.string(),
  focus: z.number(),
  vitality: z.number(),
  timestamp: z.string(),
});

// New types for symbolic systems
export interface ShadowMetrics {
  userId: string;
  frictionTaps: number;
  cancelBehaviorCount: number;
  lastSeenGhostedEvent: string;
  bedtimeScrollMinutes: number;
  entropyLevel: number; // 0 to 1 (calm → chaotic)
  lastUpdated: string;
}

export interface CrisisState {
  userId: string;
  isInCrisis: boolean;
  triggeredAt: string;
  triggerReason: string;
  score: number; // 0 to 1
  suggestedRitual?: string;
}

export interface RecoveryBloom {
  userId: string;
  triggerEventId: string;
  bloomColor: string; // e.g., "lavender-glow"
  auraVisual: string; // e.g., "rising-petals"
  recoveryDuration: number; // in days
  moodBefore: string;
  moodAfter: string;
  createdAt: string;
}

export interface SoulThread {
  userId: string;
  threadLabel: string;
  events: string[]; // Scroll IDs, dream IDs, crisis IDs
  coreSymbol?: string;
  dominantArchetype?: string;
  status: 'open' | 'looping' | 'resolving' | 'complete';
  rebirthCount: number;
  createdAt: string;
}

export interface MetaLearningEntry {
  userId: string;
  eventId: string; // ritual or scroll
  eventType: 'ritual' | 'scroll' | 'dream';
  result: 'positive' | 'neutral' | 'negative';
  impactScore: number; // 0–1
  moodBefore: string;
  moodAfter: string;
  insightsUsed: string[];
  addedToMemory: boolean;
  createdAt: string;
}

export interface Insight {
  userId: string;
  type: 'causal' | 'projection' | 'symbolic' | 'distortion';
  generatedFrom: string[]; // Scroll/ritual IDs
  content: string; // The actual insight
  confidenceScore: number; // 0–1
  createdAt: string;
}

export interface MoodForecast {
  userId: string;
  forecastDate: string;
  dailyMood: string;
  trend: 'improving' | 'stable' | 'declining';
  timestamp: string;
}

export interface Ritual {
  userId: string;
  notes?: string;
  scrollType?: string;
  createdAt: string;
}

export interface Scroll {
  userId: string;
  scrollType: string;
  insights: string[];
  createdAt: string;
}

// Type exports for AI flows
export type AnalyzeDreamInput = z.infer<typeof AnalyzeDreamInputSchema>;
export type AnalyzeDreamOutput = z.infer<typeof AnalyzeDreamOutputSchema>;
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;
export type CompanionChatInput = z.infer<typeof CompanionChatInputSchema>;
export type CompanionChatOutput = z.infer<typeof CompanionChatOutputSchema>;

export type UpdateUserSettings = z.infer<typeof UpdateUserSettingsSchema>;
export type AnalyzeCameraImageInput = z.infer<typeof AnalyzeCameraImageInputSchema>;
export type AnalyzeCameraImageOutput = z.infer<typeof AnalyzeCameraImageOutputSchema>;
export type EnrichVoiceEventInput = z.infer<typeof EnrichVoiceEventInputSchema>;
export type EnrichVoiceEventOutput = z.infer<typeof EnrichVoiceEventOutputSchema>;
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;
export type GenerateSymbolicInsightInput = z.infer<typeof GenerateSymbolicInsightInputSchema>;
export type GenerateSymbolicInsightOutput = z.infer<typeof GenerateSymbolicInsightOutputSchema>;
export type ProcessOnboardingTranscriptInput = z.infer<typeof ProcessOnboardingTranscriptInputSchema>;
export type ProcessOnboardingTranscriptOutput = z.infer<typeof ProcessOnboardingTranscriptOutputSchema>;
export type SuggestRitualInput = z.infer<typeof SuggestRitualInputSchema>;
export type SuggestRitualOutput = z.infer<typeof SuggestRitualOutputSchema>;
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type MoodLog = z.infer<typeof MoodLogSchema>;
export type AuraState = z.infer<typeof AuraStateSchema>;

// Export new symbolic types
export type ShadowMetrics = ShadowMetrics;
export type CrisisState = CrisisState;
export type RecoveryBloom = RecoveryBloom;
export type SoulThread = SoulThread;
export type MetaLearningEntry = MetaLearningEntry;
export type Insight = Insight;
export type MoodForecast = MoodForecast;
export type Ritual = Ritual;
export type Scroll = Scroll;
