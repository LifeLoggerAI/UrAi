/**
 * @fileOverview Centralized AI client wrapper with retry logic and error handling
 *
 * This module provides a unified interface for all AI operations with:
 * - Automatic retry with exponential backoff
 * - Comprehensive error handling and logging
 * - Request/response validation
 * - Performance monitoring
 */

import { ai } from './genkit';
import { z } from 'zod'; // Explicitly import z for z.infer
import {
  CompanionChatInputSchema,
  CompanionChatOutputSchema,
  TranscribeAudioInputSchema,
  TranscribeAudioOutputSchema,
  AnalyzeDreamInputSchema,
  AnalyzeDreamOutputSchema,
  EnrichVoiceEventInputSchema,
  EnrichVoiceEventOutputSchema,
  GenerateSpeechInputSchema,
  GenerateSpeechOutputSchema,
  SummarizeTextInputSchema,
  SummarizeTextOutputSchema,
  AnalyzeCameraImageInputSchema,
  AnalyzeCameraImageOutputSchema,
  GenerateSymbolicInsightInputSchema,
  GenerateSymbolicInsightOutputSchema,
  AnalyzeTextSentimentInputSchema,
  AnalyzeTextSentimentOutputSchema,
  SuggestRitualInputSchema,
  SuggestRitualOutputSchema,
  ProcessOnboardingTranscriptInputSchema,
  ProcessOnboardingTranscriptOutputSchema,
  GenerateAvatarInputSchema,
  GenerateAvatarOutputSchema,
  ChatMessageSchema // Needed for CompanionChatInputSchema
} from '@/lib/types';

// Infer types locally from schemas
type CompanionChatInput = z.infer<typeof CompanionChatInputSchema>;
type CompanionChatOutput = z.infer<typeof CompanionChatOutputSchema>;
type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;
type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;
type AnalyzeDreamInput = z.infer<typeof AnalyzeDreamInputSchema>;
type AnalyzeDreamOutput = z.infer<typeof AnalyzeDreamOutputSchema>;
type EnrichVoiceEventInput = z.infer<typeof EnrichVoiceEventInputSchema>;
type EnrichVoiceEventOutput = z.infer<typeof EnrichVoiceEventOutputSchema>;
type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;
type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;
type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;
type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;
type AnalyzeCameraImageInput = z.infer<typeof AnalyzeCameraImageInputSchema>;
type AnalyzeCameraImageOutput = z.infer<typeof AnalyzeCameraImageOutputSchema>;
type GenerateSymbolicInsightInput = z.infer<typeof GenerateSymbolicInsightInputSchema>;
type GenerateSymbolicInsightOutput = z.infer<typeof GenerateSymbolicInsightOutputSchema>;
type AnalyzeTextSentimentInput = z.infer<typeof AnalyzeTextSentimentInputSchema>;
type AnalyzeTextSentimentOutput = z.infer<typeof AnalyzeTextSentimentOutputSchema>;
type SuggestRitualInput = z.infer<typeof SuggestRitualInputSchema>;
type SuggestRitualOutput = z.infer<typeof SuggestRitualOutputSchema>;
type ProcessOnboardingTranscriptInput = z.infer<typeof ProcessOnboardingTranscriptInputSchema>;
type ProcessOnboardingTranscriptOutput = z.infer<typeof ProcessOnboardingTranscriptOutputSchema>;
type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;
type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

// Error types for better error handling
export class AIClientError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIClientError';
  }
}

export class AIRetryableError extends AIClientError {
  constructor(message: string, cause?: unknown) {
    super(message, cause, true);
    this.name = 'AIRetryableError';
  }
}

// Retry configuration
interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffFactor: 2,
};

// Sleep utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on non-retryable errors
      if (error instanceof AIClientError && !error.retryable) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === config.maxAttempts) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelayMs * Math.pow(config.backoffFactor, attempt - 1),
        config.maxDelayMs
      );
      
      console.warn(`AI operation failed (attempt ${attempt}/${config.maxAttempts}), retrying in ${delay}ms:`, error);
      await sleep(delay);
    }
  }
  
  throw new AIClientError(
    `AI operation failed after ${config.maxAttempts} attempts`,
    lastError,
    false
  );
}

// Request/response logging utility
function logAIRequest(flowName: string, input: unknown, startTime: number, result?: unknown, error?: unknown) {
  const duration = Date.now() - startTime;
  const logData = {
    flow: flowName,
    duration: `${duration}ms`,
    success: !error,
    inputSize: JSON.stringify(input).length,
    outputSize: result ? JSON.stringify(result).length : 0,
  };
  
  if (error) {
    console.error('AI Flow Error:', logData, error);
  } else {
    console.log('AI Flow Success:', logData);
  }
}

// Generic AI flow execution wrapper
async function executeAIFlow<TInput, TOutput>(
  flowName: string,
  flowFunction: (input: TInput) => Promise<TOutput | null>,
  input: TInput,
  retryConfig?: Partial<RetryConfig>
): Promise<TOutput> {
  const startTime = Date.now();
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  
  try {
    const result = await withRetry(async () => {
      try {
        const output = await flowFunction(input);
        if (!output) {
          throw new AIRetryableError(`${flowName} returned null result`);
        }
        return output;
      } catch (error) {
        if (error instanceof Error) {
          // Check for common retryable error patterns
          const errorMessage = error.message.toLowerCase();
          if (
            errorMessage.includes('timeout') ||
            errorMessage.includes('rate limit') ||
            errorMessage.includes('service unavailable') ||
            errorMessage.includes('internal error')
          ) {
            throw new AIRetryableError(`${flowName} encountered retryable error: ${error.message}`, error);
          }
        }
        throw new AIClientError(`${flowName} failed: ${error}`, error, false);
      }
    }, config);
    
    logAIRequest(flowName, input, startTime, result);
    return result;
  } catch (error) {
    logAIRequest(flowName, input, startTime, undefined, error);
    throw error;
  }
}

// Centralized AI Client class
export class AIClient {
  constructor(private retryConfig?: Partial<RetryConfig>) {}

  async companionChat(input: CompanionChatInput): Promise<CompanionChatOutput> {
    const { companionChat } = await import('./flows/companion-chat');
    return executeAIFlow('companionChat', companionChat, input, this.retryConfig);
  }

  async transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
    const { transcribeAudio } = await import('./flows/transcribe-audio');
    return executeAIFlow('transcribeAudio', transcribeAudio, input, this.retryConfig);
  }

  async analyzeDream(input: AnalyzeDreamInput): Promise<AnalyzeDreamOutput> {
    const { analyzeDream } = await import('./flows/analyze-dream');
    return executeAIFlow('analyzeDream', analyzeDream, input, this.retryConfig);
  }

  async enrichVoiceEvent(input: EnrichVoiceEventInput): Promise<EnrichVoiceEventOutput> {
    const { enrichVoiceEvent } = await import('./flows/enrich-voice-event');
    return executeAIFlow('enrichVoiceEvent', enrichVoiceEvent, input, this.retryConfig);
  }

  async generateSpeech(input: GenerateSpeechInput): Promise<GenerateSpeechOutput> {
    const { generateSpeech } = await import('./flows/generate-speech');
    return executeAIFlow('generateSpeech', generateSpeech, input, this.retryConfig);
  }

  async summarizeText(input: SummarizeTextInput): Promise<SummarizeTextOutput> {
    const { summarizeText } = await import('./flows/summarize-text');
    return executeAIFlow('summarizeText', summarizeText, input, this.retryConfig);
  }

  async analyzeCameraImage(input: AnalyzeCameraImageInput): Promise<AnalyzeCameraImageOutput> {
    const { analyzeCameraImage } = await import('./flows/analyze-camera-image');
    return executeAIFlow('analyzeCameraImage', analyzeCameraImage, input, this.retryConfig);
  }

  async generateSymbolicInsight(input: GenerateSymbolicInsightInput): Promise<GenerateSymbolicInsightOutput> {
    const { generateSymbolicInsight } = await import('./flows/generate-symbolic-insight');
    return executeAIFlow('generateSymbolicInsight', generateSymbolicInsight, input, this.retryConfig);
  }

  async analyzeTextSentiment(input: AnalyzeTextSentimentInput): Promise<AnalyzeTextSentimentOutput> {
    const { analyzeTextSentiment } = await import('./flows/analyze-text-sentiment');
    return executeAIFlow('analyzeTextSentiment', analyzeTextSentiment, input, this.retryConfig);
  }

  async suggestRitual(input: SuggestRitualInput): Promise<SuggestRitualOutput> {
    const { suggestRitual } = await import('./flows/suggest-ritual');
    return executeAIFlow('suggestRitual', suggestRitual, input, this.retryConfig);
  }

  async processOnboardingTranscript(input: ProcessOnboardingTranscriptInput): Promise<ProcessOnboardingTranscriptOutput> {
    const { processOnboardingTranscript } = await import('./flows/process-onboarding-transcript');
    return executeAIFlow('processOnboardingTranscript', processOnboardingTranscript, input, this.retryConfig);
  }

  async generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
    const { generateAvatar } = await import('./flows/generate-avatar');
    return executeAIFlow('generateAvatar', generateAvatar, input, this.retryConfig);
  }
}

// Default client instance
export const aiClient = new AIClient();

// Utility function for one-off calls
export async function callAI<TInput, TOutput>(
  flowName: keyof AIClient,
  input: TInput
): Promise<TOutput> {
  const client = new AIClient();
  return (client[flowName] as any)(input);
}