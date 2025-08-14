// src/app/actions.ts
'use server';
import 'server-only';

import type {
  VoiceEvent,
  Dream,
  DashboardData,
  CompanionChatInput,
  SuggestRitualOutput,
  ProcessOnboardingTranscriptOutput,
  MoodLog,
  AuraState,
  AnalyzeCameraImageOutput,
  AnalyzeDreamInput,
  TranscribeAudioInput,
} from '@/lib/types';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import {
  doc,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
} from 'firebase/firestore';

import {
  DashboardDataSchema,
  CompanionChatInputSchema,
  SuggestRitualInputSchema,
  MoodLogSchema,
  AuraStateSchema,
  AnalyzeCameraImageInputSchema,
  AnalyzeDreamOutputSchema,
  TranscribeAudioOutputSchema,
} from '@/lib/types';
import { format } from 'date-fns';

export async function summarizeWeekAction(
  userId: string
): Promise<{
  summary: string | null;
  audioDataUri: string | null;
  error: string | null;
}> {
  if (!userId) {
    return {
      summary: null,
      audioDataUri: null,
      error: 'User not authenticated.',
    };
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const q = query(
      collection(db, 'voiceEvents'),
      where('uid', '==', userId),
      where('createdAt', '>=', oneWeekAgo.getTime()),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        summary:
          'No memories were logged in the last week. Record some new voice notes to get your first summary!',
        audioDataUri: null,
        error: null,
      };
    }

    const allTranscripts = querySnapshot.docs
      .map(d => (d.data() as any)?.text || '')
      .filter(Boolean)
      .join('\n\n---\n\n');

    if (!allTranscripts) {
      return {
        summary:
          'No transcriptions found for your recent voice notes. Try recording a new one.',
        audioDataUri: null,
        error: null,
      };
    }

    // Call Firebase Function for summarizeText
    const summarizeResponse = await fetch(process.env.FIREBASE_FUNCTION_URL_SUMMARIZE_TEXT! || '/api/summarize-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: allTranscripts }),
    });
    const summaryResult = await summarizeResponse.json();

    if (!summarizeResponse.ok || !summaryResult?.summary) {
      console.warn('Summary generation failed via API, returning null.', summaryResult.error || summarizeResponse.statusText);
      return {
        summary: null,
        audioDataUri: null,
        error: summaryResult.error || 'API call failed',
      };
    }

    // Call the new API route for speech generation (already set up)
    const speechResponse = await fetch('/api/generate-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: summaryResult.summary }),
    });

    const speechResult = await speechResponse.json();

    if (!speechResult?.audioDataUri) {
      console.warn('TTS generation failed via API, returning summary text only.');
      return {
        summary: summaryResult.summary,
        audioDataUri: null,
        error: speechResult.error || 'API call failed',
      };
    }

    return {
      summary: summaryResult.summary,
      audioDataUri: speechResult.audioDataUri,
      error: null,
    };
  } catch (e) {
    console.error(e);
    return {
      summary: null,
      audioDataUri: null,
      error: 'An error occurred while generating the summary.',
    };
  }
}

export async function getDashboardDataAction(
  userId: string
): Promise<{ data: DashboardData | null; error: string | null }> {
  if (!userId) {
    return { data: null, error: 'User not authenticated.' };
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const voiceEventsQuery = query(
      collection(db, 'voiceEvents'),
      where('uid', '==', userId),
      where('createdAt', '>=', thirtyDaysAgo.getTime()),
      orderBy('createdAt', 'asc')
    );

    const dreamsQuery = query(
      collection(db, 'dreamEvents'),
      where('uid', '==', userId),
      where('createdAt', '>=', thirtyDaysAgo.getTime()),
      orderBy('createdAt', 'asc')
    );

    const peopleQuery = query(
      collection(db, 'people'),
      where('uid', '==', userId)
    );

    const [voiceEventsSnapshot, dreamsSnapshot, peopleSnapshot] =
      await Promise.all([
        getDocs(voiceEventsQuery),
        getDocs(dreamsQuery),
        getDocs(peopleQuery),
      ]);

    const voiceEvents = voiceEventsSnapshot.docs.map(
      d => d.data() as VoiceEvent
    );
    const dreams = dreamsSnapshot.docs.map(d => d.data() as Dream);

    // Process sentiment data (skip missing)
    const sentimentData = [...voiceEvents, ...dreams]
      .filter(e => typeof e.createdAt === 'number' && typeof (e as any).sentimentScore === 'number')
      .map(event => ({
        createdAt: event.createdAt,
        sentiment: (event as any).sentimentScore as number,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);

    // Aggregate sentiment by day (average)
    const dailySentiment = sentimentData.reduce(
      (acc, curr) => {
        const day = format(new Date(curr.createdAt), 'MMM d');
        if (!acc[day]) {
          acc[day] = { sentiment: 0, count: 0 };
        }
        acc[day].sentiment += curr.sentiment;
        acc[day].count += 1;
        return acc;
      },
      {} as Record<string, { sentiment: number; count: number }>
    );

    const sentimentOverTime = Object.entries(dailySentiment).map(
      ([date, { sentiment, count }]) => ({
        date,
        sentiment: parseFloat((sentiment / count).toFixed(2)),
      })
    );

    // Process emotion data
    const emotionCounts: Record<string, number> = {};
    voiceEvents.forEach(event => {
      const raw = (event as any)?.emotion;
      if (!raw || typeof raw !== 'string') return;
      const emotion = raw.charAt(0).toUpperCase() + raw.slice(1);
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    dreams.forEach(dream => {
      const list = (dream as any)?.emotions;
      if (!Array.isArray(list)) return;
      list.forEach((emotionRaw: string) => {
        if (!emotionRaw || typeof emotionRaw !== 'string') return;
        const emotion =
          emotionRaw.charAt(0).toUpperCase() + emotionRaw.slice(1);
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const emotionBreakdown = Object.entries(emotionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Stats
    const stats = {
      totalMemories: voiceEvents.length,
      totalDreams: dreams.length,
      totalPeople: peopleSnapshot.size,
    };

    const dashboardData: DashboardData = {
      sentimentOverTime,
      emotionBreakdown,
      stats,
    };

    const validatedData = DashboardDataSchema.safeParse(dashboardData);
    if (!validatedData.success) {
      console.error('Dashboard data validation error:', validatedData.error);
      return { data: null, error: 'Failed to validate dashboard data.' };
    }

    return { data: validatedData.data, error: null };
  } catch (e) {
    console.error('Failed to get dashboard data:', e);
    return {
      data: null,
      error: 'An error occurred while fetching dashboard data.',
    };
  }
}

type CompanionChatReturn = {
  response: string | null;
  error: string | null;
};

export async function companionChatAction(
  input: CompanionChatInput
): Promise<CompanionChatReturn> {
  const validatedFields = CompanionChatInputSchema.safeParse(input);

  if (!validatedFields.success) {
    return { response: null, error: 'Invalid input.' };
  }

  try {
    // Call Firebase Function for companionChat
    const chatResponse = await fetch(process.env.FIREBASE_FUNCTION_URL_COMPANION_CHAT! || '/api/companion-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });
    const result = await chatResponse.json();

    if (!chatResponse.ok || !result?.response) {
      console.error('Companion chat failed via API:', result?.error || chatResponse.statusText);
      return { response: null, error: result?.error || 'API call failed' };
    }
    return { response: result.response, error: null };
  } catch (e) {
    console.error('Companion chat action failed:', e);
    return {
      response: null,
      error: 'An error occurred while talking to the companion.',
    };
  }
}

type SuggestRitualReturn = {
  suggestion: SuggestRitualOutput | null;
  error: string | null;
};

export async function suggestRitualAction(
  input: z.infer<typeof SuggestRitualInputSchema>
): Promise<SuggestRitualReturn> {
  const validatedFields = SuggestRitualInputSchema.safeParse(input);
  if (!validatedFields.success) {
    return { suggestion: null, error: 'Invalid input.' };
  }

  try {
    // Call Firebase Function for suggestRitual
    const ritualResponse = await fetch(process.env.FIREBASE_FUNCTION_URL_SUGGEST_RITUAL! || '/api/suggest-ritual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });
    const result = await ritualResponse.json();

    if (!ritualResponse.ok || !result) {
      console.error('Suggest ritual failed via API:', result?.error || ritualResponse.statusText);
      return {
        suggestion: null,
        error: result?.error || 'API call failed',
      };
    }
    return { suggestion: result, error: null };
  } catch (e) {
    console.error('Suggest ritual action failed:', e);
    return {
      suggestion: null,
      error: 'An error occurred while generating a suggestion.',
    };
  }
}

const processOnboardingVoiceSchema = z.object({
  audioDataUri: z.string().min(1, 'Audio data cannot be empty.'),
});
type ProcessOnboardingVoiceInput = z.infer<typeof processOnboardingVoiceSchema>;

type ProcessOnboardingReturn = {
  transcript: string | null;
  analysis: ProcessOnboardingTranscriptOutput | null;
  error: string | null;
};

export async function processOnboardingVoiceAction(
  input: ProcessOnboardingVoiceInput
): Promise<ProcessOnboardingReturn> {
  const validatedFields = processOnboardingVoiceSchema.safeParse(input);
  if (!validatedFields.success) {
    return { transcript: null, analysis: null, error: 'Invalid input.' };
  }

  const { audioDataUri } = validatedFields.data;

  try {
    // Call Firebase Function for transcribeAudio
    const transcribeResponse = await fetch(process.env.FIREBASE_FUNCTION_URL_TRANSCRIBE_AUDIO! || '/api/transcribe-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioDataUri }),
    });
    const { transcript } = await transcribeResponse.json();

    if (!transcribeResponse.ok || !transcript) {
      console.error('Transcribe audio failed via API:', transcript?.error || transcribeResponse.statusText);
      return {
        transcript: null,
        analysis: null,
        error: transcript?.error || 'API call failed',
      };
    }

    // Call Firebase Function for processOnboardingTranscript
    const processResponse = await fetch(process.env.FIREBASE_FUNCTION_URL_PROCESS_ONBOARDING_TRANSCRIPT! || '/api/process-onboarding-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });
    const analysis = await processResponse.json();

    if (!processResponse.ok || !analysis) {
      console.error('Process onboarding transcript failed via API:', analysis?.error || processResponse.statusText);
      return {
        transcript: null,
        analysis: null,
        error: analysis?.error || 'API call failed',
      };
    }

    return { transcript, analysis, error: null };
  } catch (e) {
    console.error('Error during onboarding AI processing:', e);
    const firebaseError = e as { code?: string; message: string };
    const errorMessage =
      firebaseError?.message ||
      'An unknown error occurred during AI processing.';
    return {
      transcript: null,
      analysis: null,
      error: `Onboarding processing failed. Reason: ${errorMessage}`,
    };
  }
}

export async function analyzeAndLogCameraFrameAction(input: {
  userId: string;
  imageDataUri: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!input.userId) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    // Call the new API route for camera image analysis (already set up)
    const analyzeResponse = await fetch('/api/analyze-camera-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageDataUri: input.imageDataUri }),
    });

    const analysis: AnalyzeCameraImageOutput = await analyzeResponse.json();

    if (!analyzeResponse.ok || !analysis) {
      console.error('Camera image analysis failed via API:', analysis?.error || analyzeResponse.statusText);
      return { success: false, error: analysis?.error || 'API call failed' };
    }

    // Call Firebase Function for generateSymbolicInsight
    const insightResponse = await fetch(process.env.FIREBASE_FUNCTION_URL_GENERATE_SYMBOLIC_INSIGHT! || '/api/generate-symbolic-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis }),
    });
    const insight = await insightResponse.json();

    if (!insightResponse.ok || !insight) {
      console.error('Symbolic insight generation failed via API:', insight?.error || insightResponse.statusText);
      throw new Error(insight?.error || 'API call failed');
    }

    const primaryEmotion = Object.keys(analysis.emotionInference).reduce(
      (a, b) =>
        analysis.emotionInference[a] > analysis.emotionInference[b] ? a : b,
      'neutral'
    );

    const batch = writeBatch(db);

    // 1. Log the mood
    const moodLogRef = doc(collection(db, `users/${input.userId}/moodLogs`));
    const moodLog: MoodLog = MoodLogSchema.parse({
      timestamp: Date.now(),
      emotion: primaryEmotion,
      intensity: Math.round(
        (analysis.emotionInference[primaryEmotion] || 0) * 100
      ),
      source: 'camera_passive',
    });
    batch.set(moodLogRef, moodLog);

    // 2. Update the aura state
    const auraStateRef = doc(db, `users/${input.userId}/auraStates/current`);
    const auraState: AuraState = AuraStateSchema.parse({
      currentEmotion: primaryEmotion,
      overlayColor: analysis.dominantColor,
      overlayStyle:
        insight.symbolAnimationTrigger === 'aura_shift'
          ? 'glow'
          : insight.symbolAnimationTrigger || 'none',
      lastUpdated: Date.now(),
    });
    batch.set(auraStateRef, auraState, { merge: true });

    await batch.commit();

    return { success: true };
  } catch (e) {
    console.error('Failed to analyze and log camera frame:', e);
    return { success: false, error: (e as Error).message };
  }
}

async function fetchCollectionData(userId: string, collectionName: string) {
  const q = query(collection(db, collectionName), where('uid', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data());
}

export async function exportUserDataAction(
  userId: string
): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const collectionsToFetch = [
      { name: 'voiceEvents', data: [] as VoiceEvent[] },
      { name: 'dreamEvents', data: [] as Dream[] },
      { name: 'innerTexts', data: [] as any[] },
      { name: 'people', data: [] as any[] },
      { name: 'goals', data: [] as any[] },
      { name: 'tasks', data: [] as any[] },
      { name: `users/${userId}/memoryBlooms`, data: [] as any[] },
    ];

    await Promise.all(
      collectionsToFetch.map(async coll => {
        const q = query(
          collection(db, coll.name),
          where('uid', '==', userId)
        );
        const snapshot = await getDocs(q);
        (coll.data as any[]).push(...snapshot.docs.map(d => d.data()));
      })
    );

    const dataMap = collectionsToFetch.reduce((acc, curr) => {
      acc[curr.name.split('/').pop()!] = curr.data;
      return acc;
    }, {} as Record<string, any[]>);

    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        userId,
        version: '1.0',
        totalRecords: Object.fromEntries(
          Object.entries(dataMap).map(([key, value]) => [key, value.length])
        ),
      },
      data: {
        user: userDoc.exists() ? userDoc.data() : null,
        ...dataMap,
      },
    };

    const jsonData = JSON.stringify(exportData, null, 2);
    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(
      jsonData
    )}`;

    return {
      success: true,
      downloadUrl: dataUrl,
    };
  } catch (e) {
    console.error('Failed to export user data:', e);
    return { success: false, error: (e as Error).message };
  }
}

export async function runHealthCheckAction(): Promise<{
  overall: 'PASS' | 'FAIL' | 'UNKNOWN';
  services: any[];
}> {
  const results = {
    timestamp: new Date().toISOString(),
    services: [] as any[],
    overall: 'UNKNOWN' as 'PASS' | 'FAIL' | 'UNKNOWN',
  };

  const healthCheckTimeout = 15000; // 15 seconds

  const runFlowTest = async <I, O>(
    flowName: string,
    input: I,
    expectedSchema: z.ZodSchema<O>
  ) => {
    const startTime = Date.now();
    let status: 'PASS' | 'FAIL' = 'FAIL';
    let error: string | undefined;
    let responseTime: number;
    let isValid = false;

    try {
      const apiPath = `/${flowName.replace(/-/g, '/')}`; // e.g., 'summarize-text' -> '/summarize/text'
      const apiResponse = await Promise.race([
        fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        }),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), healthCheckTimeout)
        ),
      ]);

      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }
      const result = await apiResponse.json();
      const validated = expectedSchema.safeParse(result);

      isValid = validated.success;
      if (!isValid) {
        error = 'Invalid response shape: ' + validated.error.message;
      }
      status = isValid ? 'PASS' : 'FAIL';
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
      status = 'FAIL';
    } finally {
      responseTime = Date.now() - startTime;
      results.services.push({
        name: flowName,
        status,
        responseTime,
        error,
      });
    }
  };

  // Test Firebase Functions via API routes
  await runFlowTest('generate-speech', { text: 'Health check test' }, z.object({ audioDataUri: z.string() }));
  await runFlowTest('summarize-text', { text: 'Health check test.' }, z.object({ summary: z.string() }));
  await runFlowTest('analyze-dream', { text: 'Health check dream test' } as AnalyzeDreamInput, AnalyzeDreamOutputSchema);

  const testAudioUri =
    'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEeBDqP1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEeBDqP';
  await runFlowTest('transcribe-audio', { audioDataUri: testAudioUri } as TranscribeAudioInput, TranscribeAudioOutputSchema);

  await runFlowTest('companion-chat', { message: 'Health check', history: [] }, z.object({ response: z.string() }));
  await runFlowTest('analyze-camera-image', { imageDataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' }, AnalyzeCameraImageOutputSchema);
  await runFlowTest('generate-symbolic-insight', { analysis: { emotionInference: { joy: 0.5 }, environmentInference: [], objectTags: [], lightLevel: 0.5, faceCount: 0, dominantColor: '#FFFFFF', symbolicTagSummary: '', cameraAngle: '', faceLayoutSummary: '', backgroundMoodTags: [], contextualSymbolMatches: [], linkedArchetype: '' } }, z.object({ narratorReflection: z.string(), symbolAnimationTrigger: z.string() }));
  await runFlowTest('suggest-ritual', { zone: 'emotional', context: 'stress' }, SuggestRitualOutputSchema);
  await runFlowTest('process-onboarding-transcript', { transcript: 'Hello, I am a new user.' }, z.object({ goal: z.string(), task: z.string(), reminderDate: z.string(), habitToTrack: z.string() }));

  const allPassed = results.services.every(s => s.status === 'PASS');
  results.overall = allPassed ? 'PASS' : 'FAIL';

  return results;
}
