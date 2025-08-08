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

export interface Dream {
  id: string;
  userId: string;
  title: string;
  content: string;
  emotions?: string[];
  themes?: string[];
  symbols?: Array<{ symbol: string; interpretation: string }>;
  sentimentScore?: number;
  createdAt: string;
  updatedAt: string;
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

// Type exports for AI flows
export type AnalyzeDreamInput = z.infer<typeof AnalyzeDreamInputSchema>;
export type AnalyzeDreamOutput = z.infer<typeof AnalyzeDreamOutputSchema>;
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;
export type CompanionChatInput = z.infer<typeof CompanionChatInputSchema>;
export type CompanionChatOutput = z.infer<typeof CompanionChatOutputSchema>;