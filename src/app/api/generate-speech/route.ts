
import { NextResponse } from 'next/server';
import { generateSpeech } from '@/ai';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { GenerateSpeechInputSchema } from '@/lib/types';

export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const validatedInput = GenerateSpeechInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    const result = await generateSpeech(validatedInput.data);

    if (!result?.audioDataUri) {
      return NextResponse.json({ error: 'Speech generation failed' }, { status: 500 });
    }

    return NextResponse.json({ audioDataUri: result.audioDataUri });
  } catch (e) {
    console.error('API Speech generation failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
