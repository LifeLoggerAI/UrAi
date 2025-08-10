// src/app/api/health/route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { runHealthCheckAction } from '@/app/actions';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // ensure Node runtime, not Edge
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  try {
    const results = await runHealthCheckAction();

    return NextResponse.json(results, {
      status: results.overall === 'PASS' ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Health check API error:', error);
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overall: 'FAIL',
        error: error instanceof Error ? error.message : 'Unknown error during health check.',
      },
      { status: 500 }
    );
  }
}
