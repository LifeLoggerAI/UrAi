// src/app/api/generate-symbolic-insight/route.ts
'use server';

import { GenerateSymbolicInsightInputSchema } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedInput = GenerateSymbolicInsightInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    // Call the deployed Firebase Cloud Function for generateSymbolicInsight
    const firebaseFunctionUrl = process.env.FIREBASE_FUNCTION_URL_GENERATE_SYMBOLIC_INSIGHT;

    if (!firebaseFunctionUrl) {
      throw new Error("Firebase Function URL for generateSymbolicInsight is not configured.");
    }

    const functionResponse = await fetch(firebaseFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput.data),
    });

    const result = await functionResponse.json();

    if (!functionResponse.ok || !result) {
      console.error('Firebase Function call for Generate Symbolic Insight failed:', result?.error || functionResponse.statusText);
      return NextResponse.json({ error: result?.error || 'Firebase Function error' }, { status: functionResponse.status });
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error('API Generate Symbolic Insight failed:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}