import { buildPermissionedLegacy, legacyCandidateFromSummary } from "@/lib/legacy/buildPermissionedLegacy";
import { normalizePassportContextPermissions } from "@/lib/passport/passportContextTypes";

describe("legacy safety", () => {
  it("is off by default and saves nothing automatically", () => {
    const archive = buildPermissionedLegacy();
    expect(archive.legacyEnabled).toBe(false);
    expect(archive.items).toHaveLength(0);
    expect(archive.chapters).toHaveLength(0);
  });

  it("requires legacy enablement and approved summaries", () => {
    const closed = buildPermissionedLegacy({ userApprovedItems: [legacyCandidateFromSummary({ id: "x", type: "memory", title: "X", summary: "Summary", sourceLayerIds: ["memory"] })] });
    expect(closed.items).toHaveLength(0);
    const open = buildPermissionedLegacy({ passportProfile: { legacyEnabled: true, contextPermissions: normalizePassportContextPermissions({ allowMemoryContext: true }) }, userApprovedItems: [legacyCandidateFromSummary({ id: "x", type: "memory", title: "X", summary: "Summary", sourceLayerIds: ["memory"] })] });
    expect(open.items.some((item) => item.id === "x")).toBe(true);
  });

  it("does not save unapproved or disallowed source layers", () => {
    const archive = buildPermissionedLegacy({ passportProfile: { legacyEnabled: true, contextPermissions: normalizePassportContextPermissions({ allowMemoryContext: true }) }, userApprovedItems: [{ id: "no", type: "memory", title: "No", summary: "No", sourceLayerIds: ["memory"], userApproved: false, exportAllowed: false }, { id: "blocked", type: "memory", title: "Blocked", summary: "Blocked", sourceLayerIds: ["relationships"], userApproved: true, exportAllowed: false }] });
    expect(archive.items.some((item) => item.id === "no" || item.id === "blocked")).toBe(false);
  });

  it("blocks export unless Legacy export is enabled", () => {
    const candidate = { ...legacyCandidateFromSummary({ id: "export", type: "memory", title: "Export", summary: "Summary", sourceLayerIds: ["memory"] }), exportAllowed: true };
    const closedExport = buildPermissionedLegacy({ passportProfile: { legacyEnabled: true, legacyExportEnabled: false, contextPermissions: normalizePassportContextPermissions({ allowMemoryContext: true }) }, userApprovedItems: [candidate] });
    expect(closedExport.items[0].exportAllowed).toBe(false);
    const openExport = buildPermissionedLegacy({ passportProfile: { legacyEnabled: true, legacyExportEnabled: true, contextPermissions: normalizePassportContextPermissions({ allowMemoryContext: true }) }, userApprovedItems: [candidate] });
    expect(openExport.items[0].exportAllowed).toBe(true);
  });
});
