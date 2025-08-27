
import { NextResponse } from 'next/server';
import { transcribeAudio } from '@/ai';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { TranscribeAudioInputSchema } from '@/lib/types';


export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const validatedInput = TranscribeAudioInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    const result = await transcribeAudio(validatedInput.data);
    
    if (!result?.transcript) {
        return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
    }

    return NextResponse.json({ transcript: result.transcript });
  } catch (e) {
    console.error('API Transcribe Audio failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
