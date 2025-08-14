// src/app/api/summarize-text/route.ts
'use server';

// import { summarizeText } from 'functions/src/summarize-text'; // Removed direct import
import { SummarizeTextInputSchema } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedInput = SummarizeTextInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    // Call the deployed Firebase Cloud Function for summarizeText
    const firebaseFunctionUrl = process.env.FIREBASE_FUNCTION_URL_SUMMARIZE_TEXT;

    if (!firebaseFunctionUrl) {
      throw new Error("Firebase Function URL for summarizeText is not configured.");
    }

    const functionResponse = await fetch(firebaseFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput.data),
    });

    const result = await functionResponse.json();

    if (!functionResponse.ok || !result?.summary) {
      console.error('Firebase Function call for Summarize Text failed:', result?.error || functionResponse.statusText);
      return NextResponse.json({ error: result?.error || 'Firebase Function error' }, { status: functionResponse.status });
    }

    return NextResponse.json({ summary: result.summary });
  } catch (e) {
    console.error('API Summarize Text failed:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}