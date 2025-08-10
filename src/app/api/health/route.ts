
import { NextRequest, NextResponse } from 'next/server';
import { runHealthCheckAction } from '@/app/actions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const results = await runHealthCheckAction();

    return NextResponse.json(results, {
      status: results.overall === 'PASS' ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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
