'use server';

import { analyzeSentiment } from "@/ai/flows/analyze-sentiment";
import { summarizeTrends } from "@/ai/flows/summarize-trends";
import type { Note } from "@/lib/types";
import { z } from "zod";

const addNoteSchema = z.object({
    content: z.string().min(1, "Note cannot be empty.").max(1000, "Note is too long."),
});

export async function addNoteAction(prevState: any, formData: FormData): Promise<{ note: Note | null; error: string | null; }> {
    const validatedFields = addNoteSchema.safeParse({
        content: formData.get('content'),
    });

    if (!validatedFields.success) {
        return { note: null, error: validatedFields.error.flatten().fieldErrors.content?.[0] || "Invalid input." };
    }

    const { content } = validatedFields.data;

    try {
        const sentimentResult = await analyzeSentiment({ note: content });
        const newNote: Note = {
            id: crypto.randomUUID(),
            content,
            timestamp: Date.now(),
            sentiment: (sentimentResult.sentiment.toLowerCase() as Note['sentiment']) || 'neutral',
            score: sentimentResult.score,
        };
        return { note: newNote, error: null };
    } catch (e) {
        console.error(e);
        return { note: null, error: "Failed to analyze sentiment. Please try again." };
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
