<<<<<<< HEAD
"use server";

import { transcribeAudio as transcribeAudioFlow, type TranscribeAudioInput, type TranscribeAudioOutput } from "@/ai/flows/transcribe-audio";
import { analyzeCameraImage as analyzeCameraImageFlow, type AnalyzeCameraImageInput, type AnalyzeCameraImageOutput } from "@/ai/flows/analyze-camera-image";
import { analyzeTextSentiment as analyzeTextSentimentFlow, type AnalyzeTextSentimentInput, type AnalyzeTextSentimentOutput } from "@/ai/flows/analyze-text-sentiment";
import { analyzeDream as analyzeDreamFlow, type AnalyzeDreamInput, type AnalyzeDreamOutput } from "@/ai/flows/analyze-dream";
import { companionChat as companionChatFlow, type CompanionChatInput, type CompanionChatOutput } from "@/ai/flows/companion-chat";
import { summarizeText as summarizeTextFlow, type SummarizeTextInput, type SummarizeTextOutput } from "@/ai/flows/summarize-text";
import { generateStoryboard as generateStoryboardFlow, type GenerateStoryboardInput, type GenerateStoryboardOutput } from "@/ai/flows/generate-storyboard";
import { generateSymbolicInsight as generateSymbolicInsightFlow, type GenerateSymbolicInsightInput, type GenerateSymbolicInsightOutput } from "@/ai/flows/generate-symbolic-insight";
import { generateAvatar as generateAvatarFlow, type GenerateAvatarInput, type GenerateAvatarOutput } from "@/ai/flows/generate-avatar";
import { processOnboardingTranscript as processOnboardingTranscriptFlow, type ProcessOnboardingTranscriptInput, type ProcessOnboardingTranscriptOutput } from "@/ai/flows/process-onboarding-transcript";
import generateSpeech from "@/ai/flows/generate-speech";
import { enrichVoiceEvent as enrichVoiceEventFlow, type EnrichVoiceEventInput, type EnrichVoiceEventOutput } from "@/ai/flows/enrich-voice-event";
import { suggestRitual as suggestRitualFlow, type SuggestRitualInput, type SuggestRitualOutput } from "@/ai/flows/suggest-ritual";
=======
ise<ActionResult<GenerateStoryboardOutput>> {
    try {
        return ok(await generateStoryboardFlow(input));
    } catch(e) {
        return fail(e);
    }
}
;
import {
  analyzeCameraImage as analyzeCameraImageFlow,
  type AnalyzeCameraImageInput,
  type AnalyzeCameraImageOutput,
} from '@/ai/flows/analyze-camera-image';
import {
  analyzeTextSentiment as analyzeTextSentimentFlow,
  type AnalyzeTextSentimentInput,
  type AnalyzeTextSentimentOutput,
} from '@/ai/flows/analyze-text-sentiment';
import {
  analyzeDream as analyzeDreamFlow,
  type AnalyzeDreamInput,
  type AnalyzeDreamOutput,
} from '@/ai/flows/analyze-dream';
import {
  companionChat as companionChatFlow,
  type CompanionChatInput,
  type CompanionChatOutput,
} from '@/ai/flows/companion-chat';
import {
  summarizeText as summarizeTextFlow,
  type SummarizeTextInput,
  type SummarizeTextOutput,
} from '@/ai/flows/summarize-text';
import {
  generateSpeech as generateSpeechFlow,
  type GenerateSpeechInput,
  type GenerateSpeechOutput,
} from '@/ai/flows/generate-speech';
import {
  generateSymbolicInsight as generateSymbolicInsightFlow,
  type GenerateSymbolicInsightInput,
  type GenerateSymbolicInsightOutput,
} from '@/ai/flows/generate-symbolic-insight';
import {
  generateAvatar as generateAvatarFlow,
  type GenerateAvatarInput,
  type GenerateAvatarOutput,
} from '@/ai/flows/generate-avatar';
import {
  processOnboardingTranscript as processOnboardingTranscriptFlow,
  type ProcessOnboardingTranscriptInput,
  type ProcessOnboardingTranscriptOutput,
} from '@/ai/flows/process-onboarding-transcript';
import {
  enrichVoiceEvent as enrichVoiceEventFlow,
  type EnrichVoiceEventInput,
  type EnrichVoiceEventOutput,
} from '@/ai/flows/enrich-voice-event';
import {
  suggestRitual as suggestRitualFlow,
  type SuggestRitualInput,
  type SuggestRitualOutput,
} from '@/ai/flows/suggest-ritual';
import { getDashboardData } from '@/lib/data-access';
import { DashboardDataSchema, type DashboardData, type AnalyzeAndLogCameraFrameInput, type GenerateStoryboardInput, type GenerateStoryboardOutput } from '@/lib/types';
import { devMode, seedDemoData, DEMO_USER_ID } from '@/lib/dev-mode';
import { generateStoryboard as generateStoryboardFlow } from '@/ai/flows/generate-storyboard';
import { analyzeAndLogCameraFrameAction as analyzeAndLogCameraFrameFlow } from '@/ai/flows/analyze-and-log-camera-frame';
>>>>>>> 5be23281 (Commit before pulling remote changes)

type ActionResult<T> = { data?: T | null; error?: string | null };

// helpers
const ok = <T>(data:T|null): ActionResult<T> => ({ data, error: null });
const fail = <T>(e:any): ActionResult<T> => ({ data: null, error: (e && e.message) || "unknown error" });

// ---- Actions returned shapes your components expect ----
export async function transcribeAudio(input: Partial<TranscribeAudioInput>): Promise<ActionResult<TranscribeAudioOutput>> {
  try { return ok(await transcribeAudioFlow(input as any)); } catch(e){ return fail<TranscribeAudioOutput>(e); }
}

export async function analyzeCameraImage(input: Partial<AnalyzeCameraImageInput>): Promise<ActionResult<AnalyzeCameraImageOutput>> {
  try { return ok(await analyzeCameraImageFlow(input as any)); } catch(e){ return fail<AnalyzeCameraImageOutput>(e); }
}

export async function analyzeTextSentiment(input: Partial<AnalyzeTextSentimentInput>): Promise<ActionResult<AnalyzeTextSentimentOutput>> {
  try { return ok(await analyzeTextSentimentFlow(input as any)); } catch(e){ return fail<AnalyzeTextSentimentOutput>(e); }
}

export async function analyzeDream(input: Partial<AnalyzeDreamInput>): Promise<ActionResult<AnalyzeDreamOutput>> {
  try { return ok(await analyzeDreamFlow(input as any)); } catch(e){ return fail<AnalyzeDreamOutput>(e); }
}

export async function companionChat(input: Partial<CompanionChatInput>): Promise<ActionResult<CompanionChatOutput>> {
  try { return ok(await companionChatFlow(input as any)); } catch(e){ return fail<CompanionChatOutput>(e); }
}

export async function summarizeText(input: Partial<SummarizeTextInput>): Promise<ActionResult<SummarizeTextOutput>> {
  try { return ok(await summarizeTextFlow(input as any)); } catch(e){ return fail<SummarizeTextOutput>(e); }
}

<<<<<<< HEAD
export async function generateStoryboard(input: Partial<GenerateStoryboardInput>): Promise<ActionResult<GenerateStoryboardOutput>> {
  try { return ok(await generateStoryboardFlow(input as any)); } catch(e){ return fail<GenerateStoryboardOutput>(e); }
=======
export async function generateSymbolicInsight(
  input: Partial<GenerateSymbolicInsightInput>
): Promise<ActionResult<GenerateSymbolicInsightOutput>> {
  try {
    return ok(await generateSymbolicInsightFlow(input as any));
  } catch (e) {
    return fail<GenerateSymbolicInsightOutput>(e);
  }
>>>>>>> 5be23281 (Commit before pulling remote changes)
}

export async function generateSymbolicInsight(input: Partial<GenerateSymbolicInsightInput>): Promise<ActionResult<GenerateSymbolicInsightOutput>> {
  try { return ok(await generateSymbolicInsightFlow(input as any)); } catch(e){ return fail<GenerateSymbolicInsightOutput>(e); }
}

<<<<<<< HEAD
export async function generateAvatar(input: Partial<GenerateAvatarInput>): Promise<ActionResult<GenerateAvatarOutput>> {
  try { return ok(await generateAvatarFlow(input as any)); } catch(e){ return fail<GenerateAvatarOutput>(e); }
}

export async function generateSpeechAction(input: { text: string; voice?: string }): Promise<ActionResult<{ url: string|null; text: string }>> {
  try { return ok(await generateSpeech(input as any)); } catch(e){ return fail<{ url: string|null; text: string }>(e); }
=======
export async function generateSpeechAction(
  input: GenerateSpeechInput
): Promise<ActionResult<GenerateSpeechOutput>> {
  try {
    return ok(await generateSpeechFlow(input));
  } catch (e) {
    return fail<GenerateSpeechOutput>(e);
  }
>>>>>>> 5be23281 (Commit before pulling remote changes)
}

// onboarding helpers
export async function processOnboardingTranscript(input: Partial<ProcessOnboardingTranscriptInput>): Promise<ActionResult<ProcessOnboardingTranscriptOutput>> {
  try { return ok(await processOnboardingTranscriptFlow(input as any)); } catch(e){ return fail<ProcessOnboardingTranscriptOutput>(e); }
}

export async function processOnboardingVoiceAction(input: { audioDataUri: string } | any): Promise<ActionResult<{ transcript: string; analysis: ProcessOnboardingTranscriptOutput | null }>> {
  try {
    const t = await transcribeAudioFlow({ audioDataUri: (input && input.audioDataUri) || "" } as any);
    const analysis = await processOnboardingTranscriptFlow({ transcript: (t && t.transcript) || "" } as any);
    return ok({ transcript: t?.transcript || "", analysis });
  } catch(e){ return fail<{ transcript: string; analysis: ProcessOnboardingTranscriptOutput | null }>(e); }
}

// exported per components
<<<<<<< HEAD
export async function exportUserDataAction(): Promise<ActionResult<{ success: boolean; downloadUrl: string }>> {
  return ok({ success: true, downloadUrl: "" });
}

export async function getDashboardDataAction(): Promise<ActionResult<{ sentimentOverTime: { date: string; sentiment: number }[]; emotionBreakdown: { name: string; count: number }[]; stats: { totalMemories: number; totalDreams: number; totalPeople: number } }>> {
  return ok({ sentimentOverTime: [], emotionBreakdown: [], stats: { totalMemories: 0, totalDreams: 0, totalPeople: 0 } });
=======
export async function exportUserDataAction(
  _userId: string
): Promise<ActionResult<{ success: boolean; downloadUrl?: string }>> {
  // In a real implementation, this would trigger a secure, signed URL generation
  // via a Cloud Function. For now, we simulate success.
  console.log('Simulating user data export for', _userId);
  return ok({ success: true, downloadUrl: `/mock-data-export.json` });
}

export async function getDashboardDataAction(input: {
  uid: string;
}): Promise<ActionResult<DashboardData>> {
  try {
    const data = await getDashboardData(input.uid);
    // You might want to add validation here with Zod
    const validatedData = DashboardDataSchema.parse(data);
    return ok(validatedData);
  } catch (e) {
    return fail<DashboardData>(e);
  }
>>>>>>> 5be23281 (Commit before pulling remote changes)
}

export async function summarizeWeekAction(): Promise<ActionResult<{ summary: string }>> {
  return ok({ summary: "This week: stub summary." });
}

<<<<<<< HEAD
export async function analyzeAndLogCameraFrameAction(_input?: any): Promise<ActionResult<{ saved: boolean }>> {
  return ok({ saved: true });
=======
export async function analyzeAndLogCameraFrameAction(
  input: AnalyzeAndLogCameraFrameInput
): Promise<ActionResult<{ logged: boolean }>> {
  try {
    return ok(await analyzeAndLogCameraFrameFlow(input as any));
  } catch(e) {
    return fail(e);
  }
>>>>>>> 5be23281 (Commit before pulling remote changes)
}

export async function enrichVoiceEventAction(input: Partial<EnrichVoiceEventInput>): Promise<ActionResult<EnrichVoiceEventOutput>> {
  try { return ok(await enrichVoiceEventFlow(input as any)); } catch(e){ return fail<EnrichVoiceEventOutput>(e); }
}


export async function suggestRitualAction(input: Partial<SuggestRitualInput>): Promise<ActionResult<SuggestRitualOutput>> {
  try { return ok(await suggestRitualFlow(input as any)); } catch(e){ return fail<SuggestRitualOutput>(e); }
}

export async function seedDemoDataAction(): Promise<ActionResult<{ success: boolean }>> {
  if (!devMode) {
    return fail({ message: 'Seeding is only allowed in development mode.' });
  }
  try {
    await seedDemoData(DEMO_USER_ID);
    return ok({ success: true });
  } catch (e) {
    return fail(e);
  }
}

export async function generateStoryboard(
  input: GenerateStoryboardInput
): Prom