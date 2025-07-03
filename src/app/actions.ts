'use server';

import { enrichVoiceEvent } from "@/ai/flows/enrich-voice-event";
import type { VoiceEvent, AudioEvent, Person } from "@/lib/types";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, writeBatch, collection, query, where, getDocs, limit, increment, arrayUnion } from "firebase/firestore";
import { transcribeAudio } from "@/ai/flows/transcribe-audio";

const addAudioEventInputSchema = z.object({
    audioDataUri: z.string().min(1, "Audio data cannot be empty."),
    userId: z.string().min(1, "User ID is required."),
    durationSec: z.number().nonnegative(),
});

type AddAudioEventInput = z.infer<typeof addAudioEventInputSchema>;


type AddAudioEventReturn = {
    success: boolean;
    error: string | null;
};

export async function addAudioEventAction(input: AddAudioEventInput): Promise<AddAudioEventReturn> {
    const validatedFields = addAudioEventInputSchema.safeParse(input);

    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        return { success: false, error: firstError || "Invalid input." };
    }

    const { userId, audioDataUri, durationSec } = validatedFields.data;

    try {
        const { transcript } = await transcribeAudio({ audioDataUri });

        if (!transcript) {
            return { success: false, error: "Failed to transcribe audio." };
        }

        const analysis = await enrichVoiceEvent({ text: transcript });
        
        if (!analysis) {
            return { success: false, error: "AI analysis of the transcript failed." };
        }
        
        const audioEventId = crypto.randomUUID();
        const voiceEventId = crypto.randomUUID();
        const timestamp = Date.now();

        const batch = writeBatch(db);

        // Create AudioEvent
        const newAudioEvent: AudioEvent = {
            id: audioEventId,
            uid: userId,
            storagePath: `audio/${userId}/${audioEventId}.webm`,
            startTs: timestamp - Math.round(durationSec * 1000),
            endTs: timestamp,
            durationSec: Math.round(durationSec),
            transcriptionStatus: 'complete',
        };
        batch.set(doc(db, "audioEvents", newAudioEvent.id), newAudioEvent);

        // Create VoiceEvent
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
            people: analysis.people || [],
        };
        batch.set(doc(db, "voiceEvents", newVoiceEvent.id), newVoiceEvent);

        // Update People collection
        if (analysis.people && analysis.people.length > 0) {
            const peopleRef = collection(db, "people");
            for (const personName of analysis.people) {
                const q = query(peopleRef, where("uid", "==", userId), where("name", "==", personName), limit(1));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    // Create new person
                    const newPersonRef = doc(peopleRef);
                    const newPerson: Person = {
                        id: newPersonRef.id,
                        uid: userId,
                        name: personName,
                        lastSeen: timestamp,
                        familiarityIndex: 1,
                        socialRoleHistory: [{ date: timestamp, role: analysis.voiceArchetype }],
                        avatarUrl: `https://placehold.co/128x128.png?text=${personName.charAt(0).toUpperCase()}`
                    };
                    batch.set(newPersonRef, newPerson);
                } else {
                    // Update existing person
                    const personDoc = querySnapshot.docs[0];
                    batch.update(personDoc.ref, {
                        lastSeen: timestamp,
                        familiarityIndex: increment(1),
                        socialRoleHistory: arrayUnion({ date: timestamp, role: analysis.voiceArchetype })
                    });
                }
            }
        }
        
        await batch.commit();

        return { success: true, error: null };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to process voice event. Please try again." };
    }
}
