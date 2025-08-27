import { NextResponse } from 'next/server';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';

// This should be the URL of your deployed 'sendTestPush' Cloud Function
const sendTestPushUrl = process.env.NEXT_PUBLIC_CF_SEND_TEST_PUSH_URL || '';

export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  if (!sendTestPushUrl) {
    return NextResponse.json({ error: 'Test push function URL not configured.' }, { status: 500 });
  }

  try {
    const uidFromToken = req.user.uid;

    // Forward the request to the actual Cloud Function
    const functionResponse = await fetch(sendTestPushUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uidFromToken }), // Pass verified UID
    });

    const data = await functionResponse.json();
    const status = functionResponse.status;

    // Pass through the response from the Cloud Function
    return new NextResponse(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('API proxy error for sendTestPush:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
