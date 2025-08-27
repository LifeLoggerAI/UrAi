
import { NextResponse } from 'next/server';
import { analyzeDream } from '@/ai';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { AnalyzeDreamInputSchema } from '@/lib/types';


export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const validatedInput = AnalyzeDreamInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }
    
    const result = await analyzeDream(validatedInput.data);
    
    return NextResponse.json(result);
  } catch (e) {
    console.error('API Analyze Dream failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
