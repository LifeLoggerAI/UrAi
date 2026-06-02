import { NextResponse } from "next/server";
import { buildPermissionedCompanionContext } from "@/lib/companion/buildPermissionedContext";
import { evaluateCompanionSafety } from "@/lib/companion/companionSafety";
import { generateCompanionReply } from "@/lib/companion/generateCompanionReply";
import type { CompanionMode, GenesisMoodState } from "@/lib/companion/companionTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";

type CompanionRespondRequest = {
  message?: string;
  mode?: CompanionMode;
  councilRoleId?: string;
  moodState?: GenesisMoodState;
  userId?: string;
  contextPermissions?: Partial<PassportContextPermissions>;
};

export const runtime = "nodejs";

function normalizeMode(mode?: string): CompanionMode {
  return mode === "council" ? "council" : "companion";
}

export async function POST(request: Request) {
  let body: CompanionRespondRequest;

  try {
    body = (await request.json()) as CompanionRespondRequest;
  } catch {
    return NextResponse.json(
      {
        reply: "Something didn’t open cleanly. We can still keep this simple.",
        safetyLevel: "gentle",
        suggestedAction: { type: "none" },
      },
      { status: 200 },
    );
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
  const mode = normalizeMode(body.mode);
  const councilRoleId = mode === "council" ? body.councilRoleId ?? "guide" : undefined;
  const moodState = body.moodState ?? "luminous";
  const permissions = normalizePassportContextPermissions(body.contextPermissions);

  if (!message) {
    return NextResponse.json({
      reply: "I’m here. Say a little or a lot.",
      caption: "I’m here.",
      councilRoleId,
      safetyLevel: "normal",
      suggestedAction: { type: "none" },
    });
  }

  const safety = evaluateCompanionSafety(message, permissions);
  if (safety.boundaryReply) {
    return NextResponse.json({
      reply: safety.boundaryReply,
      caption: safety.boundaryReply.length <= 90 ? safety.boundaryReply : undefined,
      councilRoleId,
      safetyLevel: safety.safetyLevel,
      suggestedAction: safety.suggestedAction ?? { type: "none" },
    });
  }

  const context = buildPermissionedCompanionContext({
    userId: body.userId,
    moodState,
    permissions,
    mode,
    councilRoleId,
  });

  const generated = await generateCompanionReply({
    message,
    mode,
    councilRoleId,
    moodState,
    context,
  });

  return NextResponse.json({
    ...generated,
    councilRoleId,
    safetyLevel: generated.safetyLevel ?? safety.safetyLevel,
    suggestedAction: generated.suggestedAction ?? safety.suggestedAction ?? { type: "none" },
  });
}
