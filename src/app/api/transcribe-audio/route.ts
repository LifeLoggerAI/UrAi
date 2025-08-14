// src/app/api/transcribe-audio/route.ts
'use server';

import { TranscribeAudioInputSchema } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedInput = TranscribeAudioInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    // Call the deployed Firebase Cloud Function for transcribeAudio
    const firebaseFunctionUrl = process.env.FIREBASE_FUNCTION_URL_TRANSCRIBE_AUDIO;

    if (!firebaseFunctionUrl) {
      throw new Error("Firebase Function URL for transcribeAudio is not configured.");
    }

    const functionResponse = await fetch(firebaseFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput.data),
    });

    const result = await functionResponse.json();

    if (!functionResponse.ok || !result?.transcript) {
      console.error('Firebase Function call for Transcribe Audio failed:', result?.error || functionResponse.statusText);
      return NextResponse.json({ error: result?.error || 'Firebase Function error' }, { status: functionResponse.status });
    }

    return NextResponse.json({ transcript: result.transcript });
  } catch (e) {
    console.error('API Transcribe Audio failed:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}