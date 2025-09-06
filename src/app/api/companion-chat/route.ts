
import { NextResponse } from 'next/server';
import companionPrompt from '@/ai/flows/companion-chat';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { CompanionChatInputSchema } from '@/lib/types';


export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const uid = req.user.uid;
    const body = await req.json();
    const validatedInput = CompanionChatInputSchema.safeParse({ ...body, uid });

    if (!validatedInput.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedInput.error.format() }, { status: 400 });
    }

    const { history, message } = validatedInput.data;
    const { output } = await companionPrompt({ history, message });

    return NextResponse.json(output);
  } catch (e) {
    console.error('API Companion Chat failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
