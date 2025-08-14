// src/app/actions.ts
'use server';

import 'server-only';
import { ai } from '@/ai/genkit.server';
import {
  AnalyzeDreamInputSchema,
  AnalyzeTextSentimentInputSchema,
  CompanionChatInputSchema,
  GenerateSymbolicInsightInputSchema,
  ProcessOnboardingTranscriptInputSchema,
  SuggestRitualInputSchema,
  SummarizeTextInputSchema,
  TranscribeAudioInputSchema,
  AnalyzeCameraImageInputSchema,
  GenerateSpeechInputSchema,
  GenerateStoryboardInputSchema,
  DashboardDataSchema,
  UpdateUserSettingsSchema,
  exportUserDataActionSchema,
} from '@/lib/types';
import { z } from 'zod';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper for safe execution
async function safeExecute<T>(
  action: () => Promise<T>
): Promise<{ data?: T | null; error?: string | null }> {
  try {
    const data = await action();
    return { data, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred';
    console.error(`AI Action Failed: ${error}`);
    return { data: null, error };
  }
}

export async function analyzeDream(
  input: z.infer<typeof AnalyzeDreamInputSchema>
) {
  return safeExecute(async () => {
    const { analyzeDream } = await import('../ai/flows/analyze-dream');
    return analyzeDream(input);
  });
}

export async function summarizeText(
  input: z.infer<typeof SummarizeTextInputSchema>
) {
  return safeExecute(async () => {
    const { summarizeText } = await import('../ai/flows/summarize-text');
    return summarizeText(input);
  });
}

export async function transcribeAudio(
  input: z.infer<typeof TranscribeAudioInputSchema>
) {
  return safeExecute(async () => {
    const { transcribeAudio } = await import('../ai/flows/transcribe-audio');
    return transcribeAudio(input);
  });
}

export async function companionChat(
  input: z.infer<typeof CompanionChatInputSchema>
) {
  return safeExecute(async () => {
    const { companionChat } = await import('../ai/flows/companion-chat');
    return companionChat(input);
  });
}

export async function analyzeCameraImage(
  input: z.infer<typeof AnalyzeCameraImageInputSchema>
) {
  return safeExecute(async () => {
    const { analyzeCameraImage } = await import(
      '../ai/flows/analyze-camera-image'
    );
    return analyzeCameraImage(input);
  });
}

export async function generateSymbolicInsight(
  input: z.infer<typeof GenerateSymbolicInsightInputSchema>
) {
  return safeExecute(async () => {
    const { generateSymbolicInsight } = await import(
      '../ai/flows/generate-symbolic-insight'
    );
    return generateSymbolicInsight(input);
  });
}

export async function processOnboardingTranscript(
  input: z.infer<typeof ProcessOnboardingTranscriptInputSchema>
) {
  return safeExecute(async () => {
    const { processOnboardingTranscript } = await import(
      '../ai/flows/process-onboarding-transcript'
    );
    return processOnboardingTranscript(input);
  });
}

export async function analyzeTextSentiment(
  input: z.infer<typeof AnalyzeTextSentimentInputSchema>
) {
  return safeExecute(async () => {
    const { analyzeTextSentiment } = await import(
      '../ai/flows/analyze-text-sentiment'
    );
    return analyzeTextSentiment(input);
  });
}

export async function generateSpeech(
  input: z.infer<typeof GenerateSpeechInputSchema>
) {
  return safeExecute(async () => {
    const { generateSpeech } = await import('../ai/flows/generate-speech');
    return generateSpeech(input);
  });
}

export async function processOnboardingVoiceAction(input: {
  audioDataUri: string;
}) {
  return safeExecute(async () => {
    const { transcribeAudio } = await import('../ai/flows/transcribe-audio');
    const { processOnboardingTranscript } = await import(
      '../ai/flows/process-onboarding-transcript'
    );

    const transcriptionResult = await transcribeAudio(input);
    if (!transcriptionResult?.transcript) {
      throw new Error('Transcription failed.');
    }

    const analysisResult = await processOnboardingTranscript({
      transcript: transcriptionResult.transcript,
      currentDate: new Date().toISOString(),
    });

    return {
      transcript: transcriptionResult.transcript,
      analysis: analysisResult,
    };
  });
}

export async function analyzeAndLogCameraFrameAction(input: {
  userId: string;
  imageDataUri: string;
}) {
  return safeExecute(async () => {
    // This server action would contain logic to analyze the frame
    // and write results to Firestore. For now, we'll return a mock success.
    console.log(
      `Received camera frame for user ${input.userId}. Length: ${input.imageDataUri.length}`
    );
    return { success: true, message: 'Frame processed (mocked).' };
  });
}

export async function getDashboardDataAction(userId: string) {
  return safeExecute(async () => {
    // This would fetch and aggregate data from Firestore
    // Returning mock data for now
    const mockData = {
      sentimentOverTime: [
        { date: 'Day 1', sentiment: 0.2 },
        { date: 'Day 2', sentiment: -0.1 },
        { date: 'Day 3', sentiment: 0.5 },
      ],
      emotionBreakdown: [
        { name: 'Joy', count: 5 },
        { name: 'Sadness', count: 2 },
        { name: 'Curiosity', count: 8 },
      ],
      stats: {
        totalMemories: 15,
        totalDreams: 3,
        totalPeople: 4,
      },
    };
    return DashboardDataSchema.parse(mockData);
  });
}

export async function exportUserDataAction(userId: string) {
  return safeExecute(async () => {
    console.log(`Exporting data for user: ${userId}`);
    // In a real app, this would trigger a Cloud Function to securely export data
    // and return a signed URL.
    return {
      success: true,
      downloadUrl:
        'data:application/json;charset=utf-8,' +
        encodeURIComponent(
          JSON.stringify({ message: 'This is a mock data export.' })
        ),
    };
  });
}

export async function generateStoryboard(
  input: z.infer<typeof GenerateStoryboardInputSchema>
) {
  return safeExecute(async () => {
    const { generateStoryboard } = await import(
      '../ai/flows/generate-storyboard'
    );
    return generateStoryboard(input);
  });
}

// =====================
// TEMP STUB EXPORTS
// =====================

// NOTE: keep 'use server' at the very top of this file already.

export async function suggestRitualAction(input: { text?: string; mood?: string }) {
  // TODO: wire to real SuggestRitual flow
  return {
    suggestion: null,
    reason: 'stub',
    input,
  };
}

export async function enrichVoiceEvent(input: {
  transcript?: string;
  emotionHint?: string;
  tags?: string[];
}) {
  // TODO: wire to real enrichment flow
  return {
    tags: input?.tags ?? [],
    sentiment: 'neutral',
    entities: [],
    input,
  };
}
