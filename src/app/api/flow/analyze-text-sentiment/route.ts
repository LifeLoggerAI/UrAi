import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    
    // Mock sentiment analysis for smoke test
    const sentiment = {
      text: text,
      score: Math.random() * 2 - 1, // Random score between -1 and 1
      label: Math.random() > 0.5 ? 'positive' : 'negative',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(sentiment);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}