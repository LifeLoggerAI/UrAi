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

    const signup = {
      email,
      source,
      handle,
      intent,
      createdAt: new Date().toISOString()
    };

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ ok: true, mode: "dry-run", signup });
    }

    const docRef = await db.collection("waitlistSignups").add(signup);
    return NextResponse.json({ ok: true, id: docRef.id, signup });
  } catch {
    return NextResponse.json({ error: "Unable to join waitlist." }, { status: 400 });
  }
}
