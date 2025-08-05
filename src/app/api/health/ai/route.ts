import { NextRequest, NextResponse } from 'next/server';
import { AIHealthChecker } from '@/scripts/ai-health-check';

/**
 * AI Health Check API Endpoint
 * GET /api/health/ai - Returns health status of all AI flows
 */
export async function GET(request: NextRequest) {
  try {
    const checker = new AIHealthChecker();
    
    // Capture the results instead of exiting
    const originalExit = process.exit;
    let exitCode = 0;
    process.exit = ((code?: number) => {
      exitCode = code || 0;
    }) as any;

    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      logs.push(`ERROR: ${args.join(' ')}`);
      originalError(...args);
    };

    try {
      await checker.runHealthCheck();
    } catch (error) {
      // Health check completed, restore functions
      console.log = originalLog;
      console.error = originalError;
      process.exit = originalExit;
      
      return NextResponse.json(
        {
          status: 'error',
          message: 'Health check failed to run',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Restore functions
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;

    const status = exitCode === 0 ? 'healthy' : 'unhealthy';
    const httpStatus = exitCode === 0 ? 200 : 503;

    return NextResponse.json(
      {
        status,
        exitCode,
        logs,
        timestamp: new Date().toISOString(),
        message: exitCode === 0 
          ? 'All AI flows are healthy' 
          : 'Some AI flows have issues',
      },
      { status: httpStatus }
    );

  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to run AI health check',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * AI Health Check API Endpoint (POST for manual trigger)
 * POST /api/health/ai - Triggers health check and returns results
 */
export async function POST(request: NextRequest) {
  return GET(request);
}