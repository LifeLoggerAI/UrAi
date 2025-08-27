import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const leadRef = db
      .collection('leads')
      .doc(Buffer.from(email.toLowerCase()).toString('base64'));

    const snap = await leadRef.get();
    if (!snap.exists) {
      await leadRef.set({
        email: email.toLowerCase(),
        source: 'marketing_page',
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true, message: 'ok' });
  } catch (e: any) {
    console.error('Failed to write lead:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
