import { NextResponse } from "next/server";
import {
  buildCompanionReply,
  normalizeCompanionHistory,
  normalizeCompanionMessage,
  type CompanionRequestBody
} from "@/lib/companion-engine";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CompanionRequestBody;
    const message = normalizeCompanionMessage(body.message);

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const history = normalizeCompanionHistory(body.history);
    return NextResponse.json(buildCompanionReply(message, history));
  } catch {
    return NextResponse.json({ error: "Unable to process companion message." }, { status: 400 });
  }
}
