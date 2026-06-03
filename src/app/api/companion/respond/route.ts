import { NextResponse } from "next/server";
import { AI_RATE_LIMIT_REPLY, checkAIRateLimit } from "@/lib/ai/aiRateLimit";
import { classifyCompanionInput } from "@/lib/ai/aiInputSafety";
import { generateAIReply } from "@/lib/ai/generateAIReply";
import { buildPermissionedCompanionContext } from "@/lib/companion/buildPermissionedContext";
import type { CompanionMessage, CompanionMode, GenesisMoodState } from "@/lib/companion/companionTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";

const FALLBACK_REPLY = "Something didn’t open cleanly. We can still keep this simple.";

type SelectedContext = {
  selectedLifeMapStarId?: string;
  selectedGroundElementId?: string;
  selectedMirrorReflectionId?: string;
  selectedShadowReflectionId?: string;
  selectedLegacyItemId?: string;
  selectedRitualId?: string;
};

type CompanionRespondRequest = {
  message?: string;
  mode?: CompanionMode;
  councilRoleId?: string;
  moodState?: GenesisMoodState;
  userId?: string;
  passportProfile?: Partial<PassportContextPermissions>;
  contextPermissions?: Partial<PassportContextPermissions>;
  recentMessages?: CompanionMessage[];
  conversationSummary?: string;
  selectedContext?: SelectedContext;
};

export const runtime = "nodejs";

function normalizeMode(mode?: string): CompanionMode {
  return mode === "council" ? "council" : "companion";
}

function safeRateLimitKey(request: Request, body?: CompanionRespondRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return body?.userId || forwarded || "anonymous-companion-session";
}

function jsonReply(reply: string, safetyLevel: "normal" | "gentle" | "boundary" | "crisis_boundary" = "gentle", suggestedAction: { type: string; label?: string } = { type: "none" }) {
  return NextResponse.json({
    reply,
    caption: reply.length <= 90 ? reply : undefined,
    safetyLevel,
    suggestedAction,
  });
}

export async function POST(request: Request) {
  let body: CompanionRespondRequest;

  try {
    body = (await request.json()) as CompanionRespondRequest;
  } catch {
    return jsonReply(FALLBACK_REPLY, "gentle");
  }

  const rate = checkAIRateLimit(safeRateLimitKey(request, body));
  if (!rate.allowed) return jsonReply(AI_RATE_LIMIT_REPLY, "gentle");

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
  const mode = normalizeMode(body.mode);
  const councilRoleId = mode === "council" ? body.councilRoleId ?? "guide" : undefined;
  const moodState = body.moodState ?? "luminous";
  const permissions = normalizePassportContextPermissions(body.passportProfile ?? body.contextPermissions);

  if (!message) {
    return NextResponse.json({
      reply: "I’m here. Say a little or a lot.",
      caption: "I’m here.",
      councilRoleId,
      safetyLevel: "normal",
      suggestedAction: { type: "none" },
    });
  }

  const inputSafety = classifyCompanionInput(message);
  if (inputSafety.boundaryReply) {
    return NextResponse.json({
      reply: inputSafety.boundaryReply,
      caption: inputSafety.boundaryReply.length <= 90 ? inputSafety.boundaryReply : undefined,
      councilRoleId,
      safetyLevel: inputSafety.safetyLevel,
      suggestedAction: inputSafety.suggestedAction ?? { type: "none" },
    });
  }

  const context = buildPermissionedCompanionContext({
    userId: body.userId,
    moodState,
    passportProfile: permissions,
    selectedContext: body.selectedContext,
    mode,
    councilRoleId,
  });

  const generated = await generateAIReply({
    message,
    mode,
    councilRoleId,
    moodState,
    userId: body.userId,
    context,
    recentMessages: body.recentMessages,
    conversationSummary: permissions.allowCompanionSessionMemory ? body.conversationSummary : undefined,
  });

  return NextResponse.json({
    reply: generated.text || FALLBACK_REPLY,
    caption: generated.caption,
    councilRoleId: generated.councilRoleId ?? councilRoleId,
    safetyLevel: generated.safetyLevel ?? inputSafety.safetyLevel,
    suggestedAction: generated.suggestedAction ?? { type: "none" },
    sessionSummaryDelta: permissions.allowCompanionSessionMemory ? generated.sessionSummaryDelta : undefined,
  });
}
