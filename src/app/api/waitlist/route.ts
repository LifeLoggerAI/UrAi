import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { COLLECTIONS } from "@/lib/shared/urai-contracts";
import {
  checkWaitlistRateLimit,
  normalizeWaitlistSignup,
  rateLimitKeyForRequest,
  waitlistIdForEmail,
  type WaitlistRequest
} from "@/lib/waitlist";

export async function POST(req: Request) {
  try {
    const limit = checkWaitlistRateLimit(rateLimitKeyForRequest(req));
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many waitlist attempts. Please try again soon." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await req.json()) as WaitlistRequest;
    const normalized = normalizeWaitlistSignup(body);

    if (!normalized) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const signup = {
      ...normalized,
      createdAt: now,
      updatedAt: now,
      status: "joined" as const
    };

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ ok: true, mode: "dry-run", signup });
    }

    const docId = waitlistIdForEmail(normalized.email);
    const docRef = db.collection(COLLECTIONS.waitlistSignups).doc(docId);
    const existing = await docRef.get();

    if (existing.exists) {
      await docRef.set(
        {
          email: normalized.email,
          updatedAt: now,
          lastSource: normalized.source,
          lastHandle: normalized.handle,
          lastIntent: normalized.intent,
          status: "joined"
        },
        { merge: true }
      );
      return NextResponse.json({ ok: true, id: docId, duplicate: true });
    }

    await docRef.set(signup);
    return NextResponse.json({ ok: true, id: docId, signup });
  } catch {
    return NextResponse.json({ error: "Unable to join waitlist." }, { status: 400 });
  }
}
