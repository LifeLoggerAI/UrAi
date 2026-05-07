import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

type WaitlistRequest = {
  email?: unknown;
  source?: unknown;
  handle?: unknown;
  intent?: unknown;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanOptionalText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim().slice(0, maxLength);
  return cleaned || undefined;
}

function waitlistIdForEmail(email: string): string {
  return email.replace(/[^a-z0-9._-]/g, "_").slice(0, 180);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WaitlistRequest;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = cleanOptionalText(body.source, 120) ?? "unknown";
    const handle = cleanOptionalText(body.handle, 80);
    const intent = cleanOptionalText(body.intent, 120);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const signup = {
      email,
      source,
      handle,
      intent,
      createdAt: now,
      updatedAt: now,
      status: "joined"
    };

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ ok: true, mode: "dry-run", signup });
    }

    const docId = waitlistIdForEmail(email);
    const docRef = db.collection("waitlistSignups").doc(docId);
    const existing = await docRef.get();

    if (existing.exists) {
      await docRef.set(
        {
          email,
          updatedAt: now,
          lastSource: source,
          lastHandle: handle,
          lastIntent: intent,
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
