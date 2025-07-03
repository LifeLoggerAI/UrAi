'use server';

import { processVoiceEvent } from "@/ai/flows/analyze-sentiment";
import { summarizeTrends } from "@/ai/flows/summarize-trends";
import type { VoiceEvent, Transcription, EmotionState, AppData } from "@/lib/types";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const addVoiceEventSchema = z.object({
    transcript: z.string().min(1, "Transcript cannot be empty.").max(5000, "Transcript is too long."),
});

const addVoiceEventReturnSchema = z.object({
    data: z.object({ success: z.boolean() }).nullable(),
    error: z.string().nullable(),
});
type AddVoiceEventReturn = z.infer<typeof addVoiceEventReturnSchema>;

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
        const userId = 'user-placeholder'; // Replace with actual user ID after implementing auth

        const newVoiceEvent: VoiceEvent = {
            id: eventId,
            userId, 
            timestamp,
            rawAudioRef: `audio/${userId}/${eventId}.m4a`, 
            transcriptRef: `transcriptions/${eventId}`,
            detectedEmotions: analysis.detectedEmotions,
            toneScore: analysis.toneScore,
            voiceMemoryStrength: 100,
            socialArchetype: analysis.socialArchetype,
            emotionalEchoScore: analysis.emotionalEchoScore,
        };

        const newTranscription: Transcription = {
            id: eventId,
            userId,
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
            userId,
            timestamp,
            voiceEventId: eventId,
            model: 'text-fusion-v1',
            dominantEmotion: analysis.detectedEmotions[0] || 'neutral',
            blendVector: analysis.detectedEmotions.reduce((acc, e) => ({...acc, [e]: 1}), {}),
            confidence: 0.85, 
            source: 'voice',
        };

        // Write to Firestore
        await setDoc(doc(db, "voiceEvents", newVoiceEvent.id), newVoiceEvent);
        await setDoc(doc(db, "transcriptions", newTranscription.id), newTranscription);
        await setDoc(doc(db, "emotionStates", newEmotionState.id), newEmotionState);

        return { data: { success: true }, error: null };
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
