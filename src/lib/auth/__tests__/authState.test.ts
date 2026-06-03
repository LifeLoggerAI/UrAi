import { clearLocalIdentity, getLocalUserProfile, getOrCreateLocalUserId, saveLocalUserProfile } from "@/lib/auth/localIdentity";

describe("auth/local state", () => {
  it("creates a stable local user id without personal info", () => {
    const first = getOrCreateLocalUserId();
    const second = getOrCreateLocalUserId();
    expect(first).toBe(second);
    expect(first).not.toContain("@");
  });

  it("recovers from malformed local profile JSON", () => {
    window.localStorage.setItem("urai.local.profile", "not-json");
    const profile = getLocalUserProfile();
    expect(profile.userId).toBeTruthy();
    expect(profile.authMode).toBe("local");
  });

  it("stores onboarding state per local profile without adding sensitive sync", () => {
    const profile = getLocalUserProfile();
    saveLocalUserProfile({ ...profile, onboardingCompleted: true, cloudSyncEnabled: false });
    const next = getLocalUserProfile();
    expect(next.onboardingCompleted).toBe(true);
    expect(next.cloudSyncEnabled).toBe(false);
  });

  it("can clear local identity explicitly", () => {
    const id = getOrCreateLocalUserId();
    clearLocalIdentity();
    expect(window.localStorage.getItem("urai.local.userId")).toBeNull();
    expect(id).toBeTruthy();
  });
});
