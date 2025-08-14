// src/app/api/companion-chat/route.ts
'use server';

import { CompanionChatInputSchema } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedInput = CompanionChatInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    // Call the deployed Firebase Cloud Function for companionChat
    const firebaseFunctionUrl = process.env.FIREBASE_FUNCTION_URL_COMPANION_CHAT;

    if (!firebaseFunctionUrl) {
      throw new Error("Firebase Function URL for companionChat is not configured.");
    }

    const functionResponse = await fetch(firebaseFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput.data),
    });

    const result = await functionResponse.json();

    if (!functionResponse.ok || !result?.response) {
      console.error('Firebase Function call for Companion Chat failed:', result?.error || functionResponse.statusText);
      return NextResponse.json({ error: result?.error || 'Firebase Function error' }, { status: functionResponse.status });
    }

    return NextResponse.json({ response: result.response });
  } catch (e) {
    console.error('API Companion Chat failed:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}