// src/app/api/generate-speech/route.ts
'use server';

import { generateSpeech } from 'functions/src/generate-speech';
import { GenerateSpeechInputSchema } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedInput = GenerateSpeechInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    const speechResult = await generateSpeech(validatedInput.data);

    if (!speechResult?.audioDataUri) {
      return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
    }

    return NextResponse.json({ audioDataUri: speechResult.audioDataUri });
  } catch (e) {
    console.error('API Speech generation failed:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}