import { NextResponse } from "next/server";

type WaitlistRequest = {
  email?: unknown;
  source?: unknown;
  handle?: unknown;
  intent?: unknown;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WaitlistRequest;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "unknown";
    const handle = typeof body.handle === "string" ? body.handle.trim() : undefined;
    const intent = typeof body.intent === "string" ? body.intent.trim() : undefined;

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

    // V1 stores the contract shape here. Wire to Firestore Admin in the next deploy pass.
    return NextResponse.json({ ok: true, signup });
  } catch {
    return NextResponse.json({ error: "Unable to join waitlist." }, { status: 400 });
  }
}
