import { NextResponse } from 'next/server';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';
import { db } from '@/lib/firebase-admin';

// This API route queues a new export job in Firestore.
// The `exportWorker` Cloud Function will then pick it up.
export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    // 1. Get UID from the verified token, not the request body
    const uid = req.user.uid;

    // 2. Get the payload from the request
    const payload = await req.json();
    if (!payload.skyUrl || !payload.groundUrl) {
      return NextResponse.json({ error: 'Missing required asset URLs' }, { status: 400 });
    }

    // 3. Write job to the 'exportQueue' collection
    const jobRef = await db.collection('exportQueue').add({
      uid, // Use the verified UID
      status: 'queued',
      createdAt: new Date(),
      payload, // Contains skyUrl, groundUrl, overlayUrl, etc.
    });

    return NextResponse.json({ ok: true, jobId: jobRef.id });
  } catch (error: any) {
    console.error('Error queuing export job:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});
