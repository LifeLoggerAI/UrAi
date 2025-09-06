import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '@/lib/firebase-admin';

export interface AuthenticatedRequest extends NextRequest {
  user: DecodedIdToken;
}

/**
 * A higher-order function to wrap Next.js API routes with Firebase authentication.
 * It verifies the ID token from the Authorization header and passes the decoded
 * token to the handler.
 * @param handler The API route handler function, which receives the authenticated request.
 * @returns A new Next.js API route handler with authentication.
 */
export function withApiAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized: Token is missing' }, { status: 401 });
    }

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const authReq = req as AuthenticatedRequest;
      authReq.user = decodedToken;
      return handler(authReq);
    } catch (error) {
      console.error('API Auth Error: Token verification failed.', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
  };
}
