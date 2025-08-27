import { NextResponse } from 'next/server';

export async function GET() {
  const healthcheck = {
    status: 'ok',
    timestamp: Date.now(),
    checks: [] as { name: string; status: 'ok' | 'error'; message?: string }[],
  };

  // Check for essential environment variables
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    healthcheck.checks.push({ name: 'Firebase Project ID', status: 'ok' });
  } else {
    healthcheck.checks.push({ name: 'Firebase Project ID', status: 'error', message: 'Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID' });
  }

  if (process.env.GEMINI_API_KEY) {
    healthcheck.checks.push({ name: 'Gemini API Key', status: 'ok' });
  } else {
    healthcheck.checks.push({ name: 'Gemini API Key', status: 'error', message: 'Missing GEMINI_API_KEY' });
  }

  const overallStatus = healthcheck.checks.every(c => c.status === 'ok') ? 200 : 503;

  return NextResponse.json(healthcheck, { status: overallStatus });
}
