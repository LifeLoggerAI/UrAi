
import { NextResponse } from 'next/server';
import { summarizeText } from '@/ai';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { SummarizeTextInputSchema } from '@/lib/types';

export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const validatedInput = SummarizeTextInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    const result = await summarizeText(validatedInput.data);

    if (!result?.summary) {
      return NextResponse.json({ error: 'Summarization failed' }, { status: 500 });
    }
    
    return NextResponse.json({ summary: result.summary });
  } catch (e) {
    console.error('API Summarize Text failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
