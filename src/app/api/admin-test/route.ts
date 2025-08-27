import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

/**
 * Example API route using Firebase Admin SDK (server-only)
 * This demonstrates proper usage of firebase-admin in API routes
 */
export async function GET() {
  try {
    const users = await auth.listUsers(10);
    return NextResponse.json({ 
      success: true, 
      userCount: users.users.length,
      // Don't return actual user data for security
      message: 'Successfully connected to Firebase Admin'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
