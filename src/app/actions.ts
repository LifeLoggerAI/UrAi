'use server';

import { enrichVoiceEvent } from "@/ai/flows/enrich-voice-event";
import type { VoiceEvent, AudioEvent } from "@/lib/types";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { transcribeAudio } from "@/ai/flows/transcribe-audio";

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

    try {
        const { transcript } = await transcribeAudio({ audioDataUri });

        if (!transcript) {
            return { success: false, error: "Failed to transcribe audio." };
        }

        const analysis = await enrichVoiceEvent({ text: transcript });
        
        const audioEventId = crypto.randomUUID();
        const voiceEventId = crypto.randomUUID();
        const timestamp = Date.now();

        const newAudioEvent: AudioEvent = {
            id: audioEventId,
            uid: userId,
            storagePath: `audio/${userId}/${audioEventId}.webm`,
            startTs: timestamp,
            endTs: timestamp, // Placeholder
            durationSec: 0, // Placeholder
            transcriptionStatus: 'complete', // Mocked as complete
        };

        const newVoiceEvent: VoiceEvent = {
            id: voiceEventId,
            uid: userId,
            audioEventId: audioEventId,
            speakerLabel: 'user', // Mocked speaker
            text: transcript,
            createdAt: timestamp,
            emotion: analysis.emotion,
            sentimentScore: analysis.sentimentScore,
            toneShift: analysis.toneShift,
            voiceArchetype: analysis.voiceArchetype,
        };


        const batch = writeBatch(db);

        batch.set(doc(db, "audioEvents", newAudioEvent.id), newAudioEvent);
        batch.set(doc(db, "voiceEvents", newVoiceEvent.id), newVoiceEvent);
        
        await batch.commit();

        return { success: true, error: null };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to process voice event. Please try again." };
    }
}
