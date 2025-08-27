
import { NextResponse } from 'next/server';
import { suggestRitual } from '@/ai';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { SuggestRitualInputSchema } from '@/lib/types';


export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const uid = req.user.uid;
    const body = await req.json();
    const validatedInput = SuggestRitualInputSchema.safeParse({ ...body, uid });

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    const result = await suggestRitual(validatedInput.data);
    
    return NextResponse.json(result);
  } catch (e) {
    console.error('API Suggest Ritual failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
