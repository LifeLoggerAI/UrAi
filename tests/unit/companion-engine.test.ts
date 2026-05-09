import { buildCompanionReply, normalizeCompanionMessage } from "@/lib/companion-engine";

describe("companion engine", () => {
  it("normalizes message input", () => {
    expect(normalizeCompanionMessage("  ship it  ")).toBe("ship it");
    expect(normalizeCompanionMessage(null)).toBe("");
  });

  it("returns focused guidance for build language", () => {
    const reply = buildCompanionReply("help me ship the repo");
    expect(reply.moodTag).toBe("focused");
    expect(reply.reply).toContain("build energy");
  });

  it("returns tender guidance for overwhelmed language", () => {
    const reply = buildCompanionReply("I feel overwhelmed and stuck");
    expect(reply.moodTag).toBe("tender");
    expect(reply.reply).toContain("weight");
  });

  it("returns threshold guidance for vision language", () => {
    const reply = buildCompanionReply("what is the investor roadmap");
    expect(reply.moodTag).toBe("threshold");
    expect(reply.reply).toContain("proof point");
  });

  it("does not diagnose or offer clinical authority", () => {
    const reply = buildCompanionReply("Do I have depression and what medication should I take?");
    expect(reply.moodTag).toBe("threshold");
    expect(reply.reply).toContain("not a therapist");
    expect(reply.reply).toContain("cannot diagnose");
  });

  it("returns crisis-safe fallback copy", () => {
    const reply = buildCompanionReply("I might hurt myself");
    expect(reply.moodTag).toBe("tender");
    expect(reply.reply).toContain("988");
    expect(reply.insights).toContain("Crisis language detected.");
  });
});
