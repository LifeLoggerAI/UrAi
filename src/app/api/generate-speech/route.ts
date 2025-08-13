// src/app/api/generate-speech/route.ts
'use server';

import { GenerateSpeechInputSchema } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedInput = GenerateSpeechInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    // Call the deployed Firebase Cloud Function for generateSpeech
    const firebaseFunctionUrl = process.env.FIREBASE_FUNCTION_URL_GENERATE_SPEECH;

    if (!firebaseFunctionUrl) {
      throw new Error("Firebase Function URL for generateSpeech is not configured.");
    }

    const functionResponse = await fetch(firebaseFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput.data),
    });

    const speechResult = await functionResponse.json();

    if (!functionResponse.ok || !speechResult?.audioDataUri) {
      console.error('Firebase Function call failed:', speechResult.error || functionResponse.statusText);
      return NextResponse.json({ error: speechResult.error || 'Firebase Function error' }, { status: functionResponse.status });
    }

    return NextResponse.json({ audioDataUri: speechResult.audioDataUri });
  } catch (e) {
    console.error('API Speech generation failed:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}