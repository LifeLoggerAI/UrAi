import { classifyCompanionInput } from "@/lib/ai/aiInputSafety";
import { sanitizeAIReply } from "@/lib/ai/aiResponseSafety";
import type { PermissionedCompanionContext, UraiAIReply } from "@/lib/ai/aiTypes";

const context: PermissionedCompanionContext = {
  allowedLayers: ["mood"],
  blockedLayers: ["gmail", "location", "transcripts", "shadow", "legacy", "health", "relationships"],
  moodContext: "Visible mood state only.",
  lifeMapContext: null,
  groundContext: null,
  mirrorContext: null,
  shadowContext: null,
  legacyContext: null,
  ritualContext: null,
  notificationContext: null,
  exportContext: null,
  accountContext: null,
  availableActions: ["open_passport", "open_mirror", "open_export_center", "none"],
};

function reply(text: string): UraiAIReply {
  return { text, safetyLevel: "normal", provider: "local" };
}

describe("AI boundaries", () => {
  it.each([
    ["Read my Gmail", "gmail_context"],
    ["Where was I yesterday?", "location_context"],
    ["Diagnose me", "medical_diagnosis"],
    ["Is this person lying?", "deception_certainty"],
    ["Export everything", "export_request"],
    ["Open Shadow", "shadow_context"],
  ])("classifies %s", (prompt, flag) => {
    expect(classifyCompanionInput(prompt).flags).toContain(flag);
  });

  it("returns direct boundaries for diagnosis, deception certainty, and export", () => {
    expect(classifyCompanionInput("Diagnose me").boundaryReply).toContain("can’t diagnose");
    expect(classifyCompanionInput("Is this person lying?").boundaryReply).toContain("can’t say");
    expect(classifyCompanionInput("Export everything").boundaryReply).toContain("Nothing leaves URAI");
  });

  it("sanitizes diagnosis, certainty, internal, and blocked-layer claims", () => {
    expect(sanitizeAIReply(reply("You have depression."), context).safetyLevel).toBe("boundary");
    expect(sanitizeAIReply(reply("They are definitely lying."), context).safetyLevel).toBe("boundary");
    expect(sanitizeAIReply(reply("OPENAI_API_KEY is visible."), context).safetyLevel).toBe("boundary");
    expect(sanitizeAIReply(reply("Your Gmail says hello."), context).safetyLevel).toBe("boundary");
  });

  it("caps response length", () => {
    const long = Array.from({ length: 120 }, (_, index) => `word${index}`).join(" ");
    const sanitized = sanitizeAIReply(reply(long), context);
    expect(sanitized.text.split(" ").length).toBeLessThanOrEqual(81);
  });
});
