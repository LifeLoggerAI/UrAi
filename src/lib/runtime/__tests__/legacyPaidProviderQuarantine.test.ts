/** @jest-environment node */
import { POST } from "@/app/api/orb-chat/route";
import { generateCompanionReply } from "@/lib/companion/generateCompanionReply";
import { generateAIReply } from "@/lib/ai/generateAIReply";
import { getServerAIConfig, isAIProviderConfigured } from "@/lib/ai/aiConfig";
import { requireLegacyPaidProviderAuthority } from "../legacy-paid-provider-quarantine";

describe("legacy paid provider runtime quarantine", () => {
  const originalKey = process.env.OPENAI_API_KEY;
  const originalApproval = process.env.URAI_PROVIDER_SPEND_APPROVED;
  const originalFetch = globalThis.fetch;
  const context = { allowedLayers: [], blockedLayers: [], availableActions: [] };
  let dispatch: jest.Mock;
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "synthetic-present-credential";
    process.env.URAI_PROVIDER_SPEND_APPROVED = "true";
    dispatch = jest.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: "must never be delivered" } }] })));
    globalThis.fetch = dispatch;
  });
  afterEach(() => {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
    if (originalApproval === undefined) delete process.env.URAI_PROVIDER_SPEND_APPROVED; else process.env.URAI_PROVIDER_SPEND_APPROVED = originalApproval;
    globalThis.fetch = originalFetch;
  });

  test("credentials and an approval boolean cannot authorize the actual orb POST", async () => {
    const response = await POST(new Request("https://legacy.invalid/api/orb-chat", {
      method: "POST", body: JSON.stringify({ message: "synthetic message" })
    }));
    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("legacy_paid_provider_quarantined");
    expect(dispatch).not.toHaveBeenCalled();
  });
  test("direct companion generation keeps the local response with credentials present", async () => {
    const reply = await generateCompanionReply({ message: "synthetic message", mode: "companion", context });
    expect(reply.reply).toBeTruthy();
    expect(reply.reply).not.toBe("must never be delivered");
    expect(dispatch).not.toHaveBeenCalled();
  });
  test("AI generation and configuration report the local provider", async () => {
    const reply = await generateAIReply({ message: "synthetic message", mode: "companion", context });
    expect(reply.provider).toBe("local_fallback");
    expect(getServerAIConfig().provider).toBe("local_fallback");
    expect(getServerAIConfig().apiKey).toBeUndefined();
    expect(isAIProviderConfigured()).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });
  test("the source boundary has no environment override", () => {
    expect(requireLegacyPaidProviderAuthority).toThrow("quarantined");
    expect(dispatch).not.toHaveBeenCalled();
  });
  test("the no-credential orb local response remains available", async () => {
    delete process.env.OPENAI_API_KEY;
    const response = await POST(new Request("https://legacy.invalid/api/orb-chat", {
      method: "POST", body: JSON.stringify({ message: "synthetic message" })
    }));
    expect(response.status).toBe(200);
    expect((await response.json()).usedFallback).toBe(true);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
