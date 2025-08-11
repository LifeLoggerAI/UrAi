
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Minimal checks - add anything else you need here
    const envOk = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      overall: envOk ? 'PASS' : 'WARN',
      envOk,
    }, { status: envOk ? 200 : 200 });
  } catch (e: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      overall: 'FAIL',
      error: e?.message || 'Unknown error',
    }, { status: 500 });
  }
}
