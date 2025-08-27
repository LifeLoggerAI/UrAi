
import { NextResponse } from 'next/server';
import { generateSymbolicInsight } from '@/ai';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { GenerateSymbolicInsightInputSchema } from '@/lib/types';


export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const validatedInput = GenerateSymbolicInsightInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    const result = await generateSymbolicInsight(validatedInput.data);
    
    return NextResponse.json(result);
  } catch (e) {
    console.error('API Generate Symbolic Insight failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
