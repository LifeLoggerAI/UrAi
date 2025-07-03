
'use server';

import { enrichVoiceEvent } from "@/ai/flows/enrich-voice-event";
import type { VoiceEvent, AudioEvent, Person, Dream } from "@/lib/types";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, writeBatch, collection, query, where, getDocs, limit, increment, arrayUnion, Timestamp, orderBy, setDoc } from "firebase/firestore";
import { transcribeAudio } from "@/ai/flows/transcribe-audio";
import { summarizeText } from "@/ai/flows/summarize-text";
import { generateSpeech } from "@/ai/flows/generate-speech";
import { analyzeDream } from "@/ai/flows/analyze-dream";

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
            tasks: analysis.tasks || [],
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

export async function summarizeWeekAction(userId: string): Promise<{ summary: string | null; audioDataUri: string | null; error: string | null; }> {
    if (!userId) {
        return { summary: null, audioDataUri: null, error: "User not authenticated." };
    }

    try {
        const oneWeekAgo = Timestamp.fromMillis(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const q = query(
            collection(db, "voiceEvents"), 
            where("uid", "==", userId), 
            where("createdAt", ">=", oneWeekAgo.toMillis()),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { summary: "No memories were logged in the last week. Record some new voice notes to get your first summary!", audioDataUri: null, error: null };
        }

        const allTranscripts = querySnapshot.docs
            .map(doc => doc.data().text)
            .join("\n\n---\n\n");

        const summaryResult = await summarizeText({ text: allTranscripts });

        if (!summaryResult?.summary) {
            return { summary: null, audioDataUri: null, error: "Failed to generate summary." };
        }
        
        const speechResult = await generateSpeech({ text: summaryResult.summary });

        if (!speechResult?.audioDataUri) {
            console.warn("TTS generation failed, returning summary text only.");
            return { summary: summaryResult.summary, audioDataUri: null, error: null };
        }

        return { summary: summaryResult.summary, audioDataUri: speechResult.audioDataUri, error: null };

    } catch (e) {
        console.error(e);
        return { summary: null, audioDataUri: null, error: "An error occurred while generating the summary." };
    }
}

const addDreamInputSchema = z.object({
    text: z.string().min(1, "Dream entry cannot be empty."),
    userId: z.string().min(1, "User ID is required."),
});

type AddDreamInput = z.infer<typeof addDreamInputSchema>;

type AddDreamReturn = {
    success: boolean;
    error: string | null;
};

export async function addDreamAction(input: AddDreamInput): Promise<AddDreamReturn> {
    const validatedFields = addDreamInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return { success: false, error: "Invalid input." };
    }

    const { userId, text } = validatedFields.data;

    try {
        const analysis = await analyzeDream({ text });
        if (!analysis) {
            return { success: false, error: "AI analysis of the dream failed." };
        }

        const dreamId = crypto.randomUUID();
        const timestamp = Date.now();

        const newDream: Dream = {
            id: dreamId,
            uid: userId,
            text,
            createdAt: timestamp,
            emotions: analysis.emotions || [],
            themes: analysis.themes || [],
            symbols: analysis.symbols || [],
            sentimentScore: analysis.sentimentScore,
        };

        await setDoc(doc(db, "dreams", newDream.id), newDream);

        return { success: true, error: null };
    } catch (e) {
        console.error("Failed to add dream:", e);
        return { success: false, error: "Failed to save dream. Please try again." };
    }
}
