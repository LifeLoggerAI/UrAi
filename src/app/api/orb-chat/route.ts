import { NextResponse } from "next/server";
import type { OrbChatContext, OrbMessage } from "@/lib/types";

type OrbChatRequest = {
  message?: string;
  messages?: Pick<OrbMessage, "role" | "content" | "mode">[];
  context?: OrbChatContext;
};

const FALLBACK_REPLIES = [
  "I'm here. Tell me the part that feels loudest right now.",
  "I hear you. Want me to help untangle it, or just stay with you for a second?",
  "That matters. Give me one more sentence and I'll help turn it into something clear.",
  "I'm listening. We can make this lighter without pretending it isn't real.",
];

function buildSystemPrompt(context?: OrbChatContext) {
  const contextLines = [
    context?.todayMoodState ? `todayMoodState: ${context.todayMoodState}` : null,
    typeof context?.mentalLoadScore === "number" ? `mentalLoadScore: ${context.mentalLoadScore}` : null,
    context?.rhythmState ? `rhythmState: ${context.rhythmState}` : null,
    context?.lastNarratorInsight ? `lastNarratorInsight: ${context.lastNarratorInsight}` : null,
    context?.userTonePreference ? `userTonePreference: ${context.userTonePreference}` : null,
    context?.recentTimelineEvents?.length ? `recentTimelineEvents: ${context.recentTimelineEvents.join(" | ")}` : null,
    context?.relationshipSignals?.length ? `relationshipSignals: ${context.relationshipSignals.join(" | ")}` : null,
  ].filter(Boolean);

  return [
    "You are URAI, a passive cognitive companion inside the user's orb.",
    "Respond like a calm, emotionally intelligent companion, not a generic assistant.",
    "Be brief, specific, grounded, non-clinical, and supportive.",
    "Do not diagnose, over-pathologize, moralize, or pretend certainty from limited data.",
    "Ask at most one useful question unless the user clearly wants a deeper conversation.",
    "If the user seems distressed, prioritize steadiness, grounding, and practical next steps.",
    contextLines.length ? `Current URAI context:\n${contextLines.join("\n")}` : "Current URAI context: not available yet.",
  ].join("\n");
}

function getFallbackReply(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("stress") || normalized.includes("overwhelm") || normalized.includes("anxious")) {
    return "I feel the pressure in that. Let's shrink it: what is the one thing that actually has to happen next?";
  }

  if (normalized.includes("sad") || normalized.includes("alone") || normalized.includes("tired")) {
    return "I'm here with you. No performance required. Do you want comfort first, or clarity first?";
  }

  if (normalized.includes("idea") || normalized.includes("build") || normalized.includes("code")) {
    return "Good. Let's turn the energy into motion. Tell me the exact screen, function, or flow you want to lock in next.";
  }

  return FALLBACK_REPLIES[Math.abs(message.length) % FALLBACK_REPLIES.length];
}

async function generateOpenAIReply(request: OrbChatRequest, systemPrompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) return null;

  const userMessage = request.message?.trim() ?? "";
  const history = (request.messages ?? [])
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-12)
    .map((message) => ({ role: message.role, content: message.content }));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_ORB_CHAT_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        ...(userMessage ? [{ role: "user", content: userMessage }] : []),
      ],
      temperature: 0.7,
      max_tokens: 220,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = await response.json() as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as OrbChatRequest;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(body.context);
    const openAIReply = await generateOpenAIReply(body, systemPrompt);
    const reply = openAIReply ?? getFallbackReply(message);

    return NextResponse.json({
      reply,
      emotionTags: inferEmotionTags(message),
      suggestedFollowUp: "Keep talking, switch to voice, or ask URAI for the honest version.",
      memoryImportanceScore: Math.min(1, Math.max(0.25, message.length / 320)),
      usedFallback: !openAIReply,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown orb chat error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function inferEmotionTags(message: string) {
  const normalized = message.toLowerCase();
  const tags = new Set<string>();

  if (/stress|overwhelm|pressure|anxious|panic/.test(normalized)) tags.add("strain");
  if (/sad|alone|lonely|grief|miss/.test(normalized)) tags.add("tenderness");
  if (/excited|close|launch|build|code|ship/.test(normalized)) tags.add("momentum");
  if (/angry|mad|betray|trust/.test(normalized)) tags.add("friction");
  if (!tags.size) tags.add("reflection");

  return Array.from(tags);
}
