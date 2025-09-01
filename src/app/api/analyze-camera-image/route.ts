import { NextRequest, NextResponse } from 'next/server';
import { analyzeCameraImage } from '@/app/actions';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await analyzeCameraImage(data);
    
    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in analyze-camera-image route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}