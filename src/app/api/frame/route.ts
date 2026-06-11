import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '@/config';

// Gathers the metadata for the frame, such as the aspect ratio, image, and buttons.
async function getFrame(req: NextRequest) {
  const data = req.body;

  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <title>Cosmic Connections</title>
          <meta property="og:title" content="Cosmic Connections" />
          <meta property="og:image" content="${NEXT_PUBLIC_URL}/api/images/start" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${NEXT_PUBLIC_URL}/api/images/start" />
          <meta name="fc:frame:button:1" content="Cosmic Connections" />
          <meta name="fc:frame:post_url" content="${NEXT_PUBLIC_URL}/api/frame" />
        </head>
      </html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } },
  );
}

export async function POST(req: NextRequest) {
  return getFrame(req);
}

export const dynamic = 'force-dynamic';
