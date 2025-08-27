import { NextResponse } from 'next/server';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';

// This should be the URL of your deployed 'registerDevice' Cloud Function
const registerDeviceUrl = process.env.NEXT_PUBLIC_CF_REGISTER_DEVICE_URL || '';

export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  if (!registerDeviceUrl) {
    return NextResponse.json({ error: 'Register device function URL not configured.' }, { status: 500 });
  }
  
  try {
    const body = await req.json();
    const uidFromToken = req.user.uid;

    // Forward the request to the actual Cloud Function, using the verified UID
    const functionResponse = await fetch(registerDeviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, uid: uidFromToken }), // Ensure the UID is the one from the token
    });

    const data = await functionResponse.json();
    const status = functionResponse.status;

    // Pass through the response from the Cloud Function
    return new NextResponse(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('API proxy error for registerDevice:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
