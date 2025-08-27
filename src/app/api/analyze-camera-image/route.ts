
import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { analyzeCameraImage } from 'functions/src/analyze-camera-image'; // Path to the moved function
=======
import { analyzeCameraImage } from '@/ai';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { AnalyzeCameraImageInputSchema } from '@/lib/types';
>>>>>>> 5be23281 (Commit before pulling remote changes)

export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const validatedInput = AnalyzeCameraImageInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

<<<<<<< HEAD
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
=======
    const result = await analyzeCameraImage(validatedInput.data);
    
    return NextResponse.json({ data: result });
>>>>>>> 5be23281 (Commit before pulling remote changes)
  } catch (e) {
    console.error('API Camera image analysis failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
