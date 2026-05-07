import { NextResponse } from "next/server";
import { isChatMessage, type ChatMessage, type CompanionChatOutput } from "@/lib/urai-v1-schemas";

type CompanionRequest = {
  history?: unknown;
  message?: unknown;
};

function normalizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];
  return history.filter(isChatMessage).slice(-12);
}

function buildReply(message: string, history: ChatMessage[]): CompanionChatOutput {
  const trimmed = message.trim();
  const hasMomentumWords = /build|ship|repo|deploy|launch|implement|finish/i.test(trimmed);
  const hasHeavyWords = /stuck|overwhelmed|tired|anxious|scared|lost/i.test(trimmed);

  if (hasHeavyWords) {
    return {
      reply:
        "I hear the weight in that. Let’s make the next step small enough to move: name the one thing that would make today feel 5% less tangled, then we build from there.",
      moodTag: "tender",
      insights: ["Reduce scope before adding pressure.", "Use one visible next action as the recovery anchor."]
    };
  }

  if (hasMomentumWords) {
    return {
      reply:
        "Good. This is build energy. Keep it narrow: one route, one schema, one visible user moment. The constellation becomes real when someone can open it and feel it.",
      moodTag: "focused",
      insights: ["Implementation energy is rising.", "Ship the demo spine before expanding the symbolic layer."]
    };
  }

  return {
    reply:
      history.length > 0
        ? "I’m still with you. The pattern I see is continuity: keep turning the idea into something visible, one calm layer at a time."
        : "I’m listening. Start with what feels most alive right now, and I’ll help turn it into a clear next step.",
    moodTag: "calm",
    insights: ["Calm focus is the default state for this session.", "The next best move is one concrete implementation step."]
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CompanionRequest;
    const message = typeof body.message === "string" ? body.message : "";

    if (!message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const output = buildReply(message, normalizeHistory(body.history));
    return NextResponse.json(output);
  } catch {
    return NextResponse.json(
      { error: "Unable to process companion message." },
      { status: 400 }
    );
  }
}
