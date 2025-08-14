import { ai } from './genkit';
import {
  AnalyzeDreamInput,
  AnalyzeDreamOutput,
  AnalyzeTextSentimentInput,
  AnalyzeTextSentimentOutput,
  CompanionChatInput,
  CompanionChatOutput,
  GenerateSpeechInput,
  GenerateSpeechOutput,
  GenerateSymbolicInsightInput,
  GenerateSymbolicInsightOutput,
  ProcessOnboardingTranscriptInput,
  ProcessOnboardingTranscriptOutput,
  SuggestRitualInput,
  SuggestRitualOutput,
  SummarizeTextInput,
  SummarizeTextOutput,
  TranscribeAudioInput,
  TranscribeAudioOutput,
  User,
} from '@/lib/types';

import { auth, db } from '@/lib/firebase'; // Corrected import
import { UserCredential } from 'firebase/auth';
// import { functions } from 'firebase/app'; // Removed unnecessary import
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics';

// TODO: move error handling for API calls here.

export enum AIClientEvents {
  SpeechGenerated = 'ai_speech_generated',
  DreamAnalyzed = 'ai_dream_analyzed',
  TextSummarized = 'ai_text_summarized',
  AudioTranscribed = 'ai_audio_transcribed',
  CompanionChat = 'ai_companion_chat',
  // ImageAnalyzed = 'ai_image_analyzed', // Removed, as file is missing
  SymbolicInsightGenerated = 'ai_symbolic_insight_generated',
  RitualSuggested = 'ai_ritual_suggested',
  OnboardingProcessed = 'ai_onboarding_processed',
  SentimentAnalyzed = 'ai_sentiment_analyzed',
}

interface AIClientConfig {
  analytics?: Analytics;
  retryConfig?: { retries: number; delayMs: number };
}

async function executeAIFlow<I, O>(
  flowName: string,
  flowFn: (input: I) => Promise<O | null>,
  input: I,
  retryConfig?: { retries: number; delayMs: number }
): Promise<O | null> {
  let attempts = 0;
  const maxAttempts = retryConfig?.retries || 1;
  const delayMs = retryConfig?.delayMs || 1000;

  while (attempts < maxAttempts) {
    try {
      const result = await flowFn(input);
      return result;
    } catch (e) {
      console.error(`Attempt ${attempts + 1} for ${flowName} failed:`, e);
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  console.error(`All ${maxAttempts} attempts for ${flowName} failed.`);
  return null;
}

export class AIClient {
  private analytics?: Analytics;
  private retryConfig?: { retries: number; delayMs: number };

  constructor(config?: AIClientConfig) {
    this.analytics = config?.analytics;
    this.retryConfig = config?.retryConfig;
  }

  private logEvent(eventName: AIClientEvents, params?: { [key: string]: any }) {
    if (this.analytics) {
      logEvent(this.analytics, eventName, params);
    }
  }

  public async analyzeDream(
    input: AnalyzeDreamInput
  ): Promise<AnalyzeDreamOutput | null> {
    const { analyzeDream } = await import('./flows/analyze-dream');
    const result = await executeAIFlow(
      AIClientEvents.DreamAnalyzed,
      analyzeDream,
      input,
      this.retryConfig
    );
    if (result) this.logEvent(AIClientEvents.DreamAnalyzed);
    return result;
  }

  public async summarizeText(
    input: SummarizeTextInput
  ): Promise<SummarizeTextOutput | null> {
    const { summarizeText } = await import('./flows/summarize-text');
    const result = await executeAIFlow(
      AIClientEvents.TextSummarized,
      summarizeText,
      input,
      this.retryConfig
    );
    if (result) this.logEvent(AIClientEvents.TextSummarized);
    return result;
  }

  public async transcribeAudio(
    input: TranscribeAudioInput
  ): Promise<TranscribeAudioOutput | null> {
    const { transcribeAudio } = await import('./flows/transcribe-audio');
    const result = await executeAIFlow(
      AIClientEvents.AudioTranscribed,
      transcribeAudio,
      input,
      this.retryConfig
    );
    if (result) this.logEvent(AIClientEvents.AudioTranscribed);
    return result;
  }

  public async companionChat(
    input: CompanionChatInput
  ): Promise<CompanionChatOutput | null> {
    const { companionChat } = await import('./flows/companion-chat');
    const result = await executeAIFlow(
      AIClientEvents.CompanionChat,
      companionChat,
      input,
      this.retryConfig
    );
    if (result) this.logEvent(AIClientEvents.CompanionChat);
    return result;
  }

  // Removed analyzeCameraImage method as the file is missing
  // public async analyzeCameraImage(
  //   input: { userId: string; imageDataUri: string }
  // ): Promise<any | null> {
  //   const { analyzeCameraImage } = await import(
  //     './flows/analyze-camera-image'
  //   );
  //   const result = await executeAIFlow(
  //     AIClientEvents.ImageAnalyzed,
  //     analyzeCameraImage,
  //     input,
  //     this.retryConfig
  //   );
  //   if (result) this.logEvent(AIClientEvents.ImageAnalyzed);
  //   return result;
  // }

  public async generateSymbolicInsight(
    input: GenerateSymbolicInsightInput
  ): Promise<GenerateSymbolicInsightOutput | null> {
    const { generateSymbolicInsight } = await import(
      './flows/generate-symbolic-insight'
    );
    const result = await executeAIFlow(
      AIClientEvents.SymbolicInsightGenerated,
      generateSymbolicInsight,
      input,
      this.retryConfig
    );
    if (result) this.logEvent(AIClientEvents.SymbolicInsightGenerated);
    return result;
  }

  public async suggestRitual(
    input: SuggestRitualInput
  ): Promise<SuggestRitualOutput | null> {
    const { suggestRitual } = await import('./flows/suggest-ritual');
    const result = await executeAIFlow(
      AIClientEvents.RitualSuggested,
      suggestRitual,
      input,
      this.retryConfig
    );
    if (result) this.logEvent(AIClientEvents.RitualSuggested);
    return result;
  }

  public async processOnboardingTranscript(
    input: ProcessOnboardingTranscriptInput
  ): Promise<ProcessOnboardingTranscriptOutput | null> {
    const { processOnboardingTranscript } = await import(
      './flows/process-onboarding-transcript'
    );
    const result = await executeAIFlow(
      AIClientEvents.OnboardingProcessed,
      processOnboardingTranscript,
      input,
      this.retryConfig
    );
    if (result) this.logEvent(AIClientEvents.OnboardingProcessed);
    return result;
  }

  public async analyzeTextSentiment(
    input: AnalyzeTextSentimentInput
  ): Promise<AnalyzeTextSentimentOutput | null> {
    const { analyzeTextSentiment } = await import(
      './flows/analyze-text-sentiment'
    );
    const result = await executeAIFlow(
      AIClientEvents.SentimentAnalyzed,
      analyzeTextSentiment,
      input,
      this.retryConfig
    );
    if (result) this.logEvent(AIClientEvents.SentimentAnalyzed);
    return result;
  }

  public async generateSpeech(
    input: GenerateSpeechInput
  ): Promise<GenerateSpeechOutput> {
    // This should call the /api/generate-speech route
    const speechResponse = await fetch('/api/generate-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!speechResponse.ok) {
      const errorData = await speechResponse.json();
      throw new Error(
        `Speech generation failed: ${speechResponse.statusText} - ${errorData.error}`
      );
    }

    const speechResult = await speechResponse.json();
    this.logEvent(AIClientEvents.SpeechGenerated);
    return speechResult;
  }

  // Firebase Auth related methods (keep as is)
  public async signInAnonymously(): Promise<User | null> {
    const { signInAnonymously } = await import('firebase/auth');
    const userCredential: UserCredential = await signInAnonymously(auth);
    return this.getUser(userCredential.user.uid);
  }

  public async getUser(uid: string): Promise<User | null> {
    const { doc, getDoc } = await import('firebase/firestore');
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  }
}
