import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/ai/flows/generate-speech';
import { analyzeDream } from '@/ai/flows/analyze-dream';

export async function GET(request: NextRequest) {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      services: [] as any[],
      overall: 'UNKNOWN' as 'PASS' | 'FAIL' | 'UNKNOWN',
    };

    // Test generate speech flow
    try {
      const speechResult = await Promise.race([
        generateSpeech({ text: 'Health check test' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        ),
      ]);

      results.services.push({
        name: 'generate-speech',
        status: speechResult ? 'PASS' : 'FAIL',
        responseTime: Date.now(),
      });
    } catch (error) {
      results.services.push({
        name: 'generate-speech',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Test analyze dream flow
    try {
      const dreamResult = await Promise.race([
        analyzeDream({ dreamText: 'Health check dream test' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        ),
      ]);

      results.services.push({
        name: 'analyze-dream',
        status: dreamResult ? 'PASS' : 'FAIL',
        responseTime: Date.now(),
      });
    } catch (error) {
      results.services.push({
        name: 'analyze-dream',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Determine overall health
    const allPassed = results.services.every(s => s.status === 'PASS');
    results.overall = allPassed ? 'PASS' : 'FAIL';

    return NextResponse.json(results, {
      status: allPassed ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overall: 'FAIL',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
