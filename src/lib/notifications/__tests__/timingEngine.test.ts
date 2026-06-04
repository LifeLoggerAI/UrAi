import { DEFAULT_NOTIFICATION_TIMING_PROFILE, shouldSurfaceNotification } from "@/lib/notifications/timingEngine";
import type { UraiNotification } from "@/lib/notifications/notificationTypes";

const candidate: UraiNotification = {
  id: "n1",
  type: "gentle_checkin",
  title: "URAI",
  body: "A gentle note is available.",
  sourceType: "system",
  priority: "normal",
  channels: ["in_app", "push", "sms", "email"],
  status: "pending",
  createdAt: new Date().toISOString(),
};

describe("notification timing", () => {
  it("keeps push, sms, and email off by default", () => {
    expect(DEFAULT_NOTIFICATION_TIMING_PROFILE.allowPush).toBe(false);
    expect(DEFAULT_NOTIFICATION_TIMING_PROFILE.allowSms).toBe(false);
    expect(DEFAULT_NOTIFICATION_TIMING_PROFILE.allowEmail).toBe(false);
  });

  it("blocks when notifications are disabled", () => {
    const result = shouldSurfaceNotification({ candidate, timingProfile: DEFAULT_NOTIFICATION_TIMING_PROFILE, passportProfile: { notificationsEnabled: false } });
    expect(result.allowed).toBe(false);
  });

  it("blocks Shadow notification when Shadow is closed", () => {
    const result = shouldSurfaceNotification({ candidate: { ...candidate, type: "shadow_boundary", sourceType: "shadow" }, timingProfile: DEFAULT_NOTIFICATION_TIMING_PROFILE, passportProfile: { shadowEnabled: false } });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("shadow_closed");
  });

  it("respects daily and weekly limits", () => {
    const shown = Array.from({ length: 2 }, (_, index) => ({ ...candidate, id: `shown-${index}`, shownAt: new Date().toISOString() }));
    const result = shouldSurfaceNotification({ candidate: { ...candidate, id: "new" }, timingProfile: DEFAULT_NOTIFICATION_TIMING_PROFILE, recentNotifications: shown });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("daily_limit");
  });

  it("reduced sensory mode limits channels to in-app", () => {
    const result = shouldSurfaceNotification({ candidate, timingProfile: { ...DEFAULT_NOTIFICATION_TIMING_PROFILE, allowPush: true }, reducedSensoryMode: true, passportProfile: { notificationsEnabled: true } });
    expect(result.allowed).toBe(true);
    expect(result.adjustedChannel).toEqual(["in_app"]);
  });
});
