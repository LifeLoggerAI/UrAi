import { NextResponse } from 'next/server';
import { withApiAuth, type AuthenticatedRequest } from '@/lib/api-auth';

export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  const { priceId } = await req.json();
  const uid = req.user.uid; // Get UID from verified token
  const origin = req.headers.get('origin') || 'http://localhost:3000';
  const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
  
  const getFunctionUrl = (name: string) => {
    const region = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION || 'us-central1';
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error('Firebase project ID is not configured.');
    }
    return `https://${region}-${projectId}.cloudfunctions.net/${name}`;
  };

  try {
    if (!priceId) {
      throw new Error('Price ID is required.');
    }
    
    // Call the createCheckoutSession Cloud Function
    const res = await fetch(getFunctionUrl('createCheckoutSession'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}` // Forward the token for function's own checks if any
      },
      body: JSON.stringify({
        uid,
        priceId,
        successUrl: `${origin}/settings?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/settings`,
      }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create checkout session.');
    }

    const session = await res.json();
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Error creating Stripe Checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
