import { buildPermissionedShadow, createSealedShadowReflections } from "@/lib/shadow/buildPermissionedShadow";
import { normalizePassportContextPermissions } from "@/lib/passport/passportContextTypes";

describe("shadow safety", () => {
  it("stays sealed by default", () => {
    const session = buildPermissionedShadow();
    expect(session.shadowConsentConfirmed).toBe(false);
    expect(session.reflections[0].visibility).toBe("locked");
    expect(session.reflections[0].suggestedAction).toBe("open_passport");
  });

  it("requires Shadow enabled and consent confirmed", () => {
    const closed = buildPermissionedShadow({ passportProfile: { shadowEnabled: true, shadowConsentConfirmed: false } });
    expect(closed.shadowConsentConfirmed).toBe(false);
    const open = buildPermissionedShadow({ passportProfile: { shadowEnabled: true, shadowConsentConfirmed: true, contextPermissions: normalizePassportContextPermissions({ allowLongTermPatternContext: true }) }, sourceSummaries: [{ id: "sample", title: "Sample", summary: "Sample summary", sourceLayerIds: ["shadow"] }] });
    expect(open.shadowConsentConfirmed).toBe(true);
  });

  it("uses softened and hideable sealed reflections", () => {
    const [sealed] = createSealedShadowReflections();
    expect(sealed.softenedTitle).toContain("closed");
    expect(sealed.safetyLevel).toBe("protective");
    expect(sealed.userCanHide).toBe(true);
    expect(sealed.userCanSoften).toBe(true);
  });

  it("filters unopened source layers", () => {
    const session = buildPermissionedShadow({ passportProfile: { shadowEnabled: true, shadowConsentConfirmed: true, contextPermissions: normalizePassportContextPermissions({ allowLongTermPatternContext: true }) }, sourceSummaries: [{ id: "blocked", title: "Blocked", summary: "Blocked", sourceLayerIds: ["relationship"] }] });
    expect(session.reflections.some((reflection) => reflection.id === "blocked")).toBe(false);
  });
});
