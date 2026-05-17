import {
  checkWaitlistRateLimit,
  normalizeWaitlistSignup,
  resetWaitlistRateLimitForTests,
  waitlistIdForEmail
} from "@/lib/waitlist";

describe("waitlist helpers", () => {
  beforeEach(() => {
    resetWaitlistRateLimitForTests();
  });

  it("normalizes valid signups", () => {
    expect(
      normalizeWaitlistSignup({
        email: " Adam@Example.COM ",
        source: " home ",
        handle: " adamclamp ",
        intent: " demo "
      })
    ).toEqual({
      email: "adam@example.com",
      source: "home",
      handle: "adamclamp",
      intent: "demo"
    });
  });

  it("rejects invalid emails", () => {
    expect(normalizeWaitlistSignup({ email: "not-an-email" })).toBeNull();
  });

  it("creates stable firestore-safe document ids", () => {
    expect(waitlistIdForEmail("Adam+Launch@Example.com")).toBe("adam_launch_example.com");
  });

  it("limits repeated attempts within a short window", () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(checkWaitlistRateLimit("test-key", 1_000)).toEqual({ ok: true });
    }

    expect(checkWaitlistRateLimit("test-key", 1_000)).toEqual({ ok: false, retryAfterSeconds: 60 });
  });
});
