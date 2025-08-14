// src/app/api/analyze-camera-image/route.ts
'use server';

import { AnalyzeCameraImageInputSchema, AnalyzeCameraImageOutputSchema } from '@/lib/types';
import { NextResponse } from 'next/server';
import { analyzeCameraImage } from 'functions/src/analyze-camera-image'; // Path to the moved function

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedInput = AnalyzeCameraImageInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    // Call the deployed Firebase Cloud Function for analyzeCameraImage
    const firebaseFunctionUrl = process.env.FIREBASE_FUNCTION_URL_ANALYZE_CAMERA_IMAGE;

    if (!firebaseFunctionUrl) {
      throw new Error("Firebase Function URL for analyzeCameraImage is not configured.");
    }

    const functionResponse = await fetch(firebaseFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput.data),
    });

    const analysisResult = await functionResponse.json();

    if (!functionResponse.ok || !analysisResult) {
      console.error('Firebase Function call failed:', analysisResult?.error || functionResponse.statusText);
      return NextResponse.json({ error: analysisResult?.error || 'Firebase Function error' }, { status: functionResponse.status });
    }

    return NextResponse.json(analysisResult);
  } catch (e) {
    console.error('API Camera image analysis failed:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}