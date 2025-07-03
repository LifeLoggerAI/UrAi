'use server';

import { processVoiceEvent } from "@/ai/flows/analyze-sentiment";
import { summarizeTrends } from "@/ai/flows/summarize-trends";
import type { VoiceEvent, Transcription, EmotionState, AppData, Person } from "@/lib/types";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, doc, query, where, getDocs, writeBatch } from "firebase/firestore";

const addAudioEventSchema = z.object({
    audioDataUri: z.string().min(1, "Audio data cannot be empty."),
    userId: z.string().min(1, "User ID is required."),
});

type AddAudioEventReturn = {
    success: boolean;
    error: string | null;
};

export async function addAudioEventAction(userId: string, audioDataUri: string): Promise<AddAudioEventReturn> {
    const validatedFields = addAudioEventSchema.safeParse({
        audioDataUri,
        userId,
    });

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.flatten().fieldErrors.audioDataUri?.[0] || "Invalid input." };
    }

    // --- MOCK TRANSCRIPTION ---
    // In a real application, you would send the audioDataUri to a speech-to-text
    // service like Whisper via a Genkit flow here.
    // For now, we'll use a mocked transcript.
    const transcript = "I met with Sarah and we planned the project timeline. It feels like we're finally making progress, which is a huge relief. I need to remember to send her the follow-up email by Friday. John was also there.";
    // --- END MOCK ---

    try {
        const analysis = await processVoiceEvent({ transcript });
        
        const eventId = crypto.randomUUID();
        const timestamp = Date.now();

        const newVoiceEvent: VoiceEvent = {
            id: eventId,
            userId, 
            timestamp,
            rawAudioRef: `audio/${userId}/${eventId}.webm`, // Path for the new audio format
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

        const batch = writeBatch(db);

        // Add main documents to batch
        batch.set(doc(db, "voiceEvents", newVoiceEvent.id), newVoiceEvent);
        batch.set(doc(db, "transcriptions", newTranscription.id), newTranscription);
        batch.set(doc(db, "emotionStates", newEmotionState.id), newEmotionState);

        // Upsert people found in the transcript
        if (analysis.people.length > 0) {
            const peopleCol = collection(db, "people");
            for (const personName of analysis.people) {
                const q = query(peopleCol, where("userId", "==", userId), where("displayName", "==", personName));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    // New person, add to batch
                    const newPersonId = crypto.randomUUID();
                    const newPersonRef = doc(db, "people", newPersonId);
                    const newPerson: Person = {
                        id: newPersonId,
                        userId,
                        displayName: personName,
                        voiceprintRef: '', // To be implemented
                        firstDetected: timestamp,
                        lastSeen: timestamp,
                        socialRoleHistory: [],
                        familiarityIndex: 10, // Start with a base value
                        silenceDeltaDays: 0,
                    };
                    batch.set(newPersonRef, newPerson);
                } else {
                    // Existing person, update in batch
                    const personDoc = querySnapshot.docs[0];
                    batch.update(personDoc.ref, { lastSeen: timestamp });
                }
            }
        }
        
        // Commit all writes at once
        await batch.commit();

        return { success: true, error: null };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to process voice event. Please try again." };
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
