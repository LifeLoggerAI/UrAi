import { getUraiFirebaseClient } from "@/lib/firebase/firebaseClient";
import { normalizePassportContextPermissions } from "@/lib/passport/passportContextTypes";
import { canSyncLayerToCloud } from "@/lib/privacy/privacyRulesEngine";

describe("Firebase/local fallback", () => {
  it("does not crash when Firebase config is absent", () => {
    const client = getUraiFirebaseClient();
    expect(client).toBeTruthy();
  });

  it("keeps sensitive cloud sync closed by default", () => {
    const profile = normalizePassportContextPermissions();
    expect(canSyncLayerToCloud("shadow", profile)).toBe(false);
    expect(canSyncLayerToCloud("legacy", profile)).toBe(false);
    expect(canSyncLayerToCloud("companionMemory", profile)).toBe(false);
    expect(canSyncLayerToCloud("exports", profile)).toBe(false);
  });

  it("prefers restrictive sync conflicts", () => {
    const profile = normalizePassportContextPermissions({ allowCompanionCloudSync: true, allowCompanionSessionMemory: false });
    expect(canSyncLayerToCloud("companionMemory", profile)).toBe(false);
  });
});
