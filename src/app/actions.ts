
'use server';

import { enrichVoiceEvent } from "@/ai/flows/enrich-voice-event";
import type { VoiceEvent, AudioEvent, Person, Dream, UpdateUserSettings, DashboardData, CompanionChatInput, CameraCapture, SymbolicImageInsight, InnerVoiceReflection, SuggestRitualOutput, Permissions, OnboardIntake, Goal, Task, CalendarEvent, HabitWatch, AnalyzeCameraImageOutput } from "@/lib/types";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, writeBatch, collection, query, where, getDocs, limit, increment, arrayUnion, Timestamp, orderBy, setDoc, updateDoc } from "firebase/firestore";
import { transcribeAudio } from "@/ai/flows/transcribe-audio";
import { summarizeText } from "@/ai/flows/summarize-text";
import { generateSpeech } from "@/ai/flows/generate-speech";
import { analyzeDream } from "@/ai/flows/analyze-dream";
import { generateAvatar } from "@/ai/flows/generate-avatar";
import { UpdateUserSettingsSchema, DashboardDataSchema, CompanionChatInputSchema, SuggestRitualInputSchema, PermissionsSchema } from "@/lib/types";
import { format } from "date-fns";
import { companionChat } from "@/ai/flows/companion-chat";
import { analyzeCameraImage } from "@/ai/flows/analyze-camera-image";
import { generateSymbolicInsight } from "@/ai/flows/generate-symbolic-insight";
import { analyzeTextSentiment } from "@/ai/flows/analyze-text-sentiment";
import { suggestRitual } from "@/ai/flows/suggest-ritual";
import { processOnboardingTranscript } from "@/ai/flows/process-onboarding-transcript";

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
                    
                    // Generate avatar
                    const avatarResult = await generateAvatar({ name: personName, role: analysis.voiceArchetype });
                    const avatarUrl = avatarResult?.avatarDataUri || `https://placehold.co/128x128.png?text=${personName.charAt(0).toUpperCase()}`;

                    const newPerson: Person = {
                        id: newPersonRef.id,
                        uid: userId,
                        name: personName,
                        lastSeen: timestamp,
                        familiarityIndex: 1,
                        socialRoleHistory: [{ date: timestamp, role: analysis.voiceArchetype }],
                        avatarUrl: avatarUrl
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

        await setDoc(doc(db, "dreamEvents", newDream.id), newDream);

        return { success: true, error: null };
    } catch (e) {
        console.error("Failed to add dream:", e);
        return { success: false, error: "Failed to save dream. Please try again." };
    }
}


const updateUserSettingsActionInputSchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    data: UpdateUserSettingsSchema,
});

type UpdateUserSettingsReturn = {
    success: boolean;
    error: string | null;
};

export async function updateUserSettingsAction(input: z.infer<typeof updateUserSettingsActionInputSchema>): Promise<UpdateUserSettingsReturn> {
    const validatedFields = updateUserSettingsActionInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return { success: false, error: "Invalid input." };
    }

    const { userId, data } = validatedFields.data;
    
    try {
        const userRef = doc(db, "users", userId);
        
        const updatePayload: Record<string, any> = {
            displayName: data.displayName,
            'settings.moodTrackingEnabled': data.moodTrackingEnabled,
            'settings.passiveAudioEnabled': data.passiveAudioEnabled,
            'settings.faceEmotionEnabled': data.faceEmotionEnabled,
            'settings.dataExportEnabled': data.dataExportEnabled,
            'settings.narratorVolume': data.narratorVolume,
            'settings.ttsVoice': data.ttsVoice,
            'settings.gpsAllowed': data.gpsAllowed,
            'settings.dataConsent': data.dataConsent,
            'settings.allowVoiceRetention': data.allowVoiceRetention,
            'settings.receiveWeeklyEmail': data.receiveWeeklyEmail,
            'settings.receiveMilestones': data.receiveMilestones,
            'settings.emailTone': data.emailTone,
        };

        await updateDoc(userRef, updatePayload);

        return { success: true, error: null };

    } catch (e) {
        console.error("Failed to update user settings:", e);
        return { success: false, error: "Failed to update settings. Please try again." };
    }
}


export async function getDashboardDataAction(userId: string): Promise<{ data: DashboardData | null; error: string | null; }> {
    if (!userId) {
        return { data: null, error: "User not authenticated." };
    }

    try {
        const thirtyDaysAgo = Timestamp.fromMillis(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const voiceEventsQuery = query(
            collection(db, "voiceEvents"), 
            where("uid", "==", userId), 
            where("createdAt", ">=", thirtyDaysAgo.toMillis()),
            orderBy("createdAt", "asc")
        );

        const dreamsQuery = query(
            collection(db, "dreamEvents"),
            where("uid", "==", userId),
            where("createdAt", ">=", thirtyDaysAgo.toMillis()),
            orderBy("createdAt", "asc")
        );

        const peopleQuery = query(collection(db, "people"), where("uid", "==", userId));

        const [voiceEventsSnapshot, dreamsSnapshot, peopleSnapshot] = await Promise.all([
            getDocs(voiceEventsQuery),
            getDocs(dreamsQuery),
            getDocs(peopleQuery),
        ]);

        const voiceEvents = voiceEventsSnapshot.docs.map(doc => doc.data() as VoiceEvent);
        const dreams = dreamsSnapshot.docs.map(doc => doc.data() as Dream);

        // Process sentiment data
        const sentimentData = [...voiceEvents, ...dreams].map(event => ({
            createdAt: event.createdAt,
            sentiment: event.sentimentScore
        })).sort((a, b) => a.createdAt - b.createdAt);
        
        // Aggregate sentiment by day (average)
        const dailySentiment = sentimentData.reduce((acc, curr) => {
            const day = format(new Date(curr.createdAt), "MMM d");
            if (!acc[day]) {
                acc[day] = { sentiment: 0, count: 0 };
            }
            acc[day].sentiment += curr.sentiment;
            acc[day].count += 1;
            return acc;
        }, {} as Record<string, { sentiment: number; count: number }>);

        const sentimentOverTime = Object.entries(dailySentiment).map(([date, { sentiment, count }]) => ({
            date,
            sentiment: parseFloat((sentiment / count).toFixed(2)),
        }));

        // Process emotion data
        const emotionCounts: Record<string, number> = {};
        voiceEvents.forEach(event => {
            const emotion = event.emotion.charAt(0).toUpperCase() + event.emotion.slice(1);
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
        dreams.forEach(dream => {
            dream.emotions.forEach(emotionRaw => {
                const emotion = emotionRaw.charAt(0).toUpperCase() + emotionRaw.slice(1);
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
            console.error("Dashboard data validation error:", validatedData.error);
            return { data: null, error: "Failed to validate dashboard data." };
        }

        return { data: validatedData.data, error: null };
    } catch (e) {
        console.error("Failed to get dashboard data:", e);
        return { data: null, error: "An error occurred while fetching dashboard data." };
    }
}


type CompanionChatReturn = {
    response: string | null;
    error: string | null;
};

export async function companionChatAction(input: CompanionChatInput): Promise<CompanionChatReturn> {
    const validatedFields = CompanionChatInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return { response: null, error: "Invalid input." };
    }

    try {
        const result = await companionChat(validatedFields.data);
        if (!result?.response) {
            return { response: null, error: "The AI companion failed to respond." };
        }
        return { response: result.response, error: null };
    } catch (e) {
        console.error("Companion chat action failed:", e);
        return { response: null, error: "An error occurred while talking to the companion." };
    }
}


const addCameraCaptureInputSchema = z.object({
    imageDataUri: z.string().min(1, "Image data cannot be empty."),
    userId: z.string().min(1, "User ID is required."),
    triggerType: z.enum(['emotional_spike', 'ritual_end', 'gps_change', 'manual', 'forecast_trigger', 'voice_peak']),
});

type AddCameraCaptureInput = z.infer<typeof addCameraCaptureInputSchema>;

export async function addCameraCaptureAction(input: AddCameraCaptureInput): Promise<{ success: boolean, error: string | null }> {
    const validatedFields = addCameraCaptureInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return { success: false, error: "Invalid input." };
    }
    
    const { userId, imageDataUri, triggerType } = validatedFields.data;

    try {
        const analysis: AnalyzeCameraImageOutput | null = await analyzeCameraImage({ imageDataUri });
        if (!analysis) {
            return { success: false, error: "AI analysis of the image failed." };
        }

        const batch = writeBatch(db);
        const captureId = crypto.randomUUID();
        const timestamp = Date.now();
        
        const newCapture: CameraCapture = {
            id: captureId,
            uid: userId,
            imageUrl: `captures/${userId}/${captureId}.jpg`, // Placeholder path
            createdAt: timestamp,
            triggerType,
            ...analysis,
        };

        batch.set(doc(db, "cameraCaptures", newCapture.id), newCapture);

        const insight = await generateSymbolicInsight({ analysis });
        if(insight) {
            const insightId = crypto.randomUUID();
            const newInsight: SymbolicImageInsight = {
                id: insightId,
                uid: userId,
                cameraCaptureId: captureId,
                ...insight
            };
            batch.set(doc(db, "symbolicImageInsights", insightId), newInsight);
        }
        
        await batch.commit();

        return { success: true, error: null };
    } catch (e) {
        console.error("Failed to add camera capture:", e);
        return { success: false, error: "Failed to save camera capture. Please try again." };
    }
}


const addInnerTextSchema = z.object({
    text: z.string().min(1, "Text entry cannot be empty."),
    userId: z.string().min(1, "User ID is required."),
});

type AddInnerTextInput = z.infer<typeof addInnerTextSchema>;

export async function addInnerTextAction(input: AddInnerTextInput): Promise<{ success: boolean, error: string | null }> {
    const validatedFields = addInnerTextSchema.safeParse(input);

    if (!validatedFields.success) {
        return { success: false, error: "Invalid input." };
    }

    const { userId, text } = validatedFields.data;

    try {
        const analysis = await analyzeTextSentiment({ text });
        if (!analysis) {
            return { success: false, error: "AI analysis of the text failed." };
        }

        const reflectionId = crypto.randomUUID();
        const timestamp = Date.now();

        const newReflection: InnerVoiceReflection = {
            id: reflectionId,
            uid: userId,
            text,
            createdAt: timestamp,
            sentimentScore: analysis.sentimentScore,
        };

        await setDoc(doc(db, "innerTexts", newReflection.id), newReflection);

        return { success: true, error: null };
    } catch (e) {
        console.error("Failed to add inner text reflection:", e);
        return { success: false, error: "Failed to save reflection. Please try again." };
    }
}


type SuggestRitualReturn = {
    suggestion: SuggestRitualOutput | null;
    error: string | null;
}

export async function suggestRitualAction(input: z.infer<typeof SuggestRitualInputSchema>): Promise<SuggestRitualReturn> {
    const validatedFields = SuggestRitualInputSchema.safeParse(input);
    if (!validatedFields.success) {
        return { suggestion: null, error: "Invalid input." };
    }
    
    try {
        const result = await suggestRitual(validatedFields.data);
        if (!result) {
             return { suggestion: null, error: "Could not generate a suggestion at this time." };
        }
        return { suggestion: result, error: null };
    } catch (e) {
        console.error("Suggest ritual action failed:", e);
        return { suggestion: null, error: "An error occurred while generating a suggestion." };
    }
}

const savePermissionsInputSchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    permissions: PermissionsSchema,
});

export async function savePermissionsAction(input: z.infer<typeof savePermissionsInputSchema>): Promise<{success: boolean, error: string | null}> {
    const validatedFields = savePermissionsInputSchema.safeParse(input);
    if (!validatedFields.success) {
        return { success: false, error: "Invalid input." };
    }
    
    const { userId, permissions } = validatedFields.data;
    
    try {
        const permissionsRef = doc(db, "permissions", userId);
        await setDoc(permissionsRef, permissions);
        return { success: true, error: null };
    } catch (e) {
        console.error("Failed to save permissions:", e);
        return { success: false, error: "Failed to save permissions. Please try again." };
    }
}


const processOnboardingVoiceSchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    audioDataUri: z.string().min(1, "Audio data cannot be empty."),
});

type ProcessOnboardingVoiceInput = z.infer<typeof processOnboardingVoiceSchema>;

export async function processOnboardingVoiceAction(input: ProcessOnboardingVoiceInput): Promise<{success: boolean, error: string | null}> {
    const validatedFields = processOnboardingVoiceSchema.safeParse(input);
    if (!validatedFields.success) {
        return { success: false, error: "Invalid input." };
    }

    const { userId, audioDataUri } = validatedFields.data;
    const timestamp = Date.now();

    try {
        const { transcript } = await transcribeAudio({ audioDataUri });

        if (!transcript) {
            return { success: false, error: "Failed to transcribe audio." };
        }

        const intakeId = crypto.randomUUID();
        const intakeDoc: OnboardIntake = {
            id: intakeId,
            uid: userId,
            fullTranscript: transcript,
            createdAt: timestamp
        };

        const analysis = await processOnboardingTranscript({ transcript });

        if (!analysis) {
            return { success: false, error: "Failed to analyze onboarding transcript." };
        }

        const batch = writeBatch(db);

        // 1. Save the raw intake
        batch.set(doc(db, "onboardIntake", intakeId), intakeDoc);

        // 2. Create Goal
        if (analysis.goal) {
            const goalId = crypto.randomUUID();
            const newGoal: Goal = { id: goalId, uid: userId, title: analysis.goal, createdAt: timestamp };
            batch.set(doc(db, "goals", goalId), newGoal);
        }

        // 3. Create Task
        if (analysis.task && analysis.reminderDate) {
            const taskId = crypto.randomUUID();
            const newTask: Task = { 
                id: taskId, 
                uid: userId, 
                title: analysis.task, 
                dueDate: new Date(analysis.reminderDate).getTime(), 
                status: 'pending' 
            };
            batch.set(doc(db, "tasks", taskId), newTask);

            // 4. Create Calendar Event (mirroring task)
            const eventId = crypto.randomUUID();
            const newEvent: CalendarEvent = {
                id: eventId,
                uid: userId,
                title: analysis.task,
                startTime: new Date(analysis.reminderDate).getTime(),
                contextSource: 'onboarding'
            };
            batch.set(doc(db, "calendarEvents", eventId), newEvent);
        }

        // 5. Create Habit to Watch
        if (analysis.habitToTrack) {
            const habitId = crypto.randomUUID();
            const newHabit: HabitWatch = {
                id: habitId,
                uid: userId,
                name: analysis.habitToTrack,
                frequency: "daily", // default
                context: "userOnboard"
            };
            batch.set(doc(db, "habitWatch", habitId), newHabit);
        }

        // 6. Mark onboarding as complete
        const userRef = doc(db, "users", userId);
        batch.update(userRef, { onboardingComplete: true });

        await batch.commit();

        return { success: true, error: null };

    } catch (e) {
        console.error("Failed to process onboarding voice:", e);
        return { success: false, error: "Failed to process onboarding. Please try again." };
    }
}
