import type { CompanionMode, GenesisMoodState } from "./companionTypes";
import type { PermissionedCompanionContext } from "./buildPermissionedContext";
import type { CompanionSafetyLevel, CompanionSuggestedAction } from "./companionSafety";
import { summarizePermissionedContextForPrompt } from "./buildPermissionedContext";
import { getCompanionSystemPrompt } from "./companionSystemPrompts";
import { generateLocalCompanionResponse } from "./localCompanionResponder";

type GenerateCompanionReplyInput = {
  message: string;
  mode: CompanionMode;
  councilRoleId?: string;
  moodState?: GenesisMoodState;
  context: PermissionedCompanionContext;
};

export type GenerateCompanionReplyResult = {
  reply: string;
  caption?: string;
  councilRoleId?: string;
  safetyLevel: CompanionSafetyLevel;
  suggestedAction?: CompanionSuggestedAction;
};

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function cleanReply(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, 520);
}

function fallbackReply(input: GenerateCompanionReplyInput): GenerateCompanionReplyResult {
  const local = generateLocalCompanionResponse(input.message, {
    mode: input.mode,
    councilRoleId: input.councilRoleId,
    moodState: input.moodState,
  });

  return {
    reply: local.text,
    caption: local.text.length <= 90 ? local.text : undefined,
    councilRoleId: input.mode === "council" ? input.councilRoleId : undefined,
    safetyLevel: "normal",
    suggestedAction: { type: "none" },
  };
}

export async function generateCompanionReply(input: GenerateCompanionReplyInput): Promise<GenerateCompanionReplyResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackReply(input);

  const systemPrompt = getCompanionSystemPrompt(input.mode, input.councilRoleId);
  const permissionedContext = summarizePermissionedContextForPrompt(input.context);

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.45,
        max_tokens: 140,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "system", content: `Permissioned context only:\n${permissionedContext}` },
          { role: "user", content: input.message.slice(0, 500) },
        ],
      }),
    });

    if (!response.ok) return fallbackReply(input);

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = cleanReply(data.choices?.[0]?.message?.content ?? "");
    if (!reply) return fallbackReply(input);

    return {
      reply,
      caption: reply.length <= 90 ? reply : undefined,
      councilRoleId: input.mode === "council" ? input.councilRoleId : undefined,
      safetyLevel: "normal",
      suggestedAction: { type: "none" },
    };
  } catch {
    return fallbackReply(input);
  }
}
