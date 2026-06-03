import { getServerAIConfig, OPENAI_API_URL } from "./aiConfig";
import { buildAIRequestMessages } from "./buildAIRequestMessages";
import { sanitizeAIReply } from "./aiResponseSafety";
import { createAILogMetadata, logAIMetadata } from "./aiLoggingPolicy";
import type { UraiAIReply, UraiAIRequest } from "./aiTypes";
import { getCompanionSystemPrompt } from "@/lib/companion/companionSystemPrompts";
import { generateLocalCompanionResponse } from "@/lib/companion/localCompanionResponder";

function localReply(request: UraiAIRequest, safetyLevel: UraiAIReply["safetyLevel"] = "normal"): UraiAIReply {
  const local = generateLocalCompanionResponse(request.message, {
    mode: request.mode,
    councilRoleId: request.councilRoleId,
    moodState: request.moodState,
  });
  return sanitizeAIReply(
    {
      text: local.text,
      caption: local.text.length <= 90 ? local.text : undefined,
      councilRoleId: request.mode === "council" ? request.councilRoleId : undefined,
      safetyLevel,
      suggestedAction: { type: "none" },
      provider: "local_fallback",
    },
    request.context,
  );
}

function parseSuggestedAction(text: string): UraiAIReply["suggestedAction"] {
  const lowered = text.toLowerCase();
  if (lowered.includes("passport")) return { type: "open_passport", label: "Open Passport" };
  if (lowered.includes("ground")) return { type: "open_ground", label: "Open Ground" };
  if (lowered.includes("life map") || lowered.includes("sky")) return { type: "open_life_map", label: "Open Life Map" };
  if (lowered.includes("mirror")) return { type: "open_mirror", label: "Open Mirror" };
  if (lowered.includes("ritual")) return { type: "start_ritual", label: "Start Ritual" };
  if (lowered.includes("setting") || lowered.includes("quiet")) return { type: "open_settings", label: "Open Settings" };
  if (lowered.includes("export")) return { type: "open_export_center", label: "Open Export Center" };
  return { type: "none" };
}

function normalizeModelText(text: string): string {
  return text.replace(/\s+/g, " ").trim().replace(/^URAI:\s*/i, "");
}

export async function generateAIReply(request: UraiAIRequest): Promise<UraiAIReply> {
  const config = getServerAIConfig();
  if (config.provider !== "openai" || !config.apiKey) {
    const fallback = localReply(request);
    logAIMetadata(createAILogMetadata({ provider: "local_fallback", mode: request.mode, safetyLevel: fallback.safetyLevel, suggestedActionType: fallback.suggestedAction?.type ?? "none", success: true }));
    return fallback;
  }

  const systemPrompt = getCompanionSystemPrompt(request.mode, request.councilRoleId);
  const messages = buildAIRequestMessages({
    systemPrompt,
    userMessage: request.message,
    context: request.context,
    recentMessages: request.recentMessages,
    conversationSummary: request.conversationSummary,
  });

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.35,
        max_tokens: request.councilRoleId === "archivist" ? 180 : 150,
        messages,
      }),
    });

    if (!response.ok) {
      const fallback = localReply(request, "gentle");
      logAIMetadata(createAILogMetadata({ provider: "openai", mode: request.mode, safetyLevel: fallback.safetyLevel, suggestedActionType: fallback.suggestedAction?.type ?? "none", success: false }));
      return fallback;
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = normalizeModelText(data.choices?.[0]?.message?.content ?? "");
    if (!text) return localReply(request, "gentle");

    const sanitized = sanitizeAIReply(
      {
        text,
        caption: text.length <= 90 ? text : undefined,
        councilRoleId: request.mode === "council" ? request.councilRoleId : undefined,
        safetyLevel: "normal",
        suggestedAction: parseSuggestedAction(text),
        shouldStoreSummary: false,
        provider: "openai",
      },
      request.context,
    );
    logAIMetadata(createAILogMetadata({ provider: "openai", mode: request.mode, safetyLevel: sanitized.safetyLevel, suggestedActionType: sanitized.suggestedAction?.type ?? "none", success: true }));
    return sanitized;
  } catch {
    const fallback = localReply(request, "gentle");
    logAIMetadata(createAILogMetadata({ provider: "openai", mode: request.mode, safetyLevel: fallback.safetyLevel, suggestedActionType: fallback.suggestedAction?.type ?? "none", success: false }));
    return fallback;
  }
}
