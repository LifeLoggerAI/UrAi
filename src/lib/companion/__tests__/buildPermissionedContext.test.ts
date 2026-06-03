import { buildPermissionedCompanionContext } from "@/lib/companion/buildPermissionedContext";
import { normalizePassportContextPermissions } from "@/lib/passport/passportContextTypes";

describe("buildPermissionedCompanionContext", () => {
  it("includes only allowed layers and lists blocked layers", () => {
    const context = buildPermissionedCompanionContext({ mode: "companion", passportProfile: normalizePassportContextPermissions({ allowMoodContext: true }) });
    expect(context.allowedLayers).toContain("mood");
    expect(context.blockedLayers).toContain("gmail");
    expect(context.blockedLayers).toContain("location");
    expect(JSON.stringify(context).toLowerCase()).not.toContain("gmail content");
  });

  it("does not include raw transcripts, Gmail, location, or Passport profile", () => {
    const context = buildPermissionedCompanionContext({ mode: "companion", passportProfile: normalizePassportContextPermissions() });
    const serialized = JSON.stringify(context).toLowerCase();
    expect(serialized).not.toContain("raw transcript");
    expect(serialized).not.toContain("raw gmail");
    expect(serialized).not.toContain("exact location");
    expect(serialized).not.toContain("allowgmailcontext");
  });

  it("includes Shadow and Legacy only with explicit layered permission", () => {
    const closed = buildPermissionedCompanionContext({ mode: "companion", passportProfile: normalizePassportContextPermissions({ allowShadowCloudSync: true, allowLegacyCloudSync: true }) });
    expect(closed.shadowContext).toBeNull();
    expect(closed.legacyContext).toBeNull();
    const open = buildPermissionedCompanionContext({ mode: "companion", passportProfile: normalizePassportContextPermissions({ allowShadowCloudSync: true, allowLongTermPatternContext: true, allowLegacyCloudSync: true, allowMemoryContext: true }) });
    expect(open.shadowContext).toContain("explicit permission");
    expect(open.legacyContext).toContain("explicit permission");
  });

  it("includes selected Life Map and Ground summaries only if memory is allowed", () => {
    const closed = buildPermissionedCompanionContext({ mode: "companion", selectedContext: { selectedLifeMapStarId: "star", selectedGroundElementId: "ground" }, passportProfile: normalizePassportContextPermissions() });
    expect(closed.lifeMapContext).toBeNull();
    expect(closed.groundContext).toBeNull();
    const open = buildPermissionedCompanionContext({ mode: "companion", selectedContext: { selectedLifeMapStarId: "star", selectedGroundElementId: "ground" }, passportProfile: normalizePassportContextPermissions({ allowMemoryContext: true }) });
    expect(open.lifeMapContext).toContain("summary only");
    expect(open.groundContext).toContain("summary only");
  });
});
