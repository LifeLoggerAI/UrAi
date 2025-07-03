'use server';

import { processVoiceEvent } from "@/ai/flows/analyze-sentiment";
import { summarizeTrends } from "@/ai/flows/summarize-trends";
import type { VoiceEvent, Transcription, EmotionState, AppData } from "@/lib/types";
import { z } from "zod";

const addVoiceEventSchema = z.object({
    transcript: z.string().min(1, "Transcript cannot be empty.").max(5000, "Transcript is too long."),
});

type AddVoiceEventReturn = {
    data: AppData | null;
    error: string | null;
};

export async function addVoiceEventAction(prevState: any, formData: FormData): Promise<AddVoiceEventReturn> {
    const validatedFields = addVoiceEventSchema.safeParse({
        transcript: formData.get('content'),
    });

    if (!validatedFields.success) {
        return { data: null, error: validatedFields.error.flatten().fieldErrors.transcript?.[0] || "Invalid input." };
    }

    const { transcript } = validatedFields.data;

    try {
        const analysis = await processVoiceEvent({ transcript });
        
        const eventId = crypto.randomUUID();
        const timestamp = Date.now();

        const newVoiceEvent: VoiceEvent = {
            id: eventId,
            userId: 'user-placeholder', 
            timestamp,
            rawAudioRef: `audio/user-placeholder/${eventId}.m4a`, 
            transcriptRef: `transcriptions/${eventId}`,
            detectedEmotions: analysis.detectedEmotions,
            toneScore: analysis.toneScore,
            voiceMemoryStrength: 100,
            socialArchetype: analysis.socialArchetype,
            emotionalEchoScore: analysis.emotionalEchoScore,
        };

        const newTranscription: Transcription = {
            id: eventId, // Use same ID for 1-to-1 mapping
            userId: 'user-placeholder',
            voiceEventId: eventId,
            fullText: transcript,
            summary: analysis.summary,
            tags: analysis.tags,
            people: analysis.people,
            tasks: analysis.tasks,
            sentiment: analysis.toneScore > 0.1 ? 'positive' : analysis.toneScore < -0.1 ? 'negative' : 'neutral',
        };

        const newEmotionState: EmotionState = {
            id: crypto.randomUUID(),
            userId: 'user-placeholder',
            timestamp,
            model: 'text-fusion-v1',
            dominantEmotion: analysis.detectedEmotions[0] || 'neutral',
            blendVector: analysis.detectedEmotions.reduce((acc, e) => ({...acc, [e]: 1}), {}),
            confidence: 0.85, 
            source: 'voice',
        };

        return { data: { voiceEvent: newVoiceEvent, transcription: newTranscription, emotionState: newEmotionState }, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: "Failed to process voice event. Please try again." };
    }
}


const summarizeTrendsSchema = z.object({
    notes: z.array(z.string()),
});

export async function summarizeTrendsAction(notes: string[]): Promise<{ summary: string | null; error: string | null; }> {
    const validatedFields = summarizeTrendsSchema.safeParse({ notes });

    if (!validatedFields.success) {
        return { summary: null, error: "Invalid notes data." };
    }

    if (notes.length === 0) {
        return { summary: null, error: "No notes to summarize." };
    }
    
    try {
        const result = await summarizeTrends({ notes });
        return { summary: result.summary, error: null };
    } catch (e) {
        console.error(e);
        return { summary: null, error: "Failed to summarize trends. Please try again." };
    }
}
