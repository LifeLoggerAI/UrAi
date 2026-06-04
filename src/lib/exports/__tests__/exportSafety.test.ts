import { reviewExportCandidate } from "@/lib/exports/buildPermissionedExport";
import { normalizePassportContextPermissions } from "@/lib/passport/passportContextTypes";

const candidate = {
  id: "artifact-1",
  type: "legacy_scroll" as const,
  title: "Safe Summary",
  summary: "Summary only.",
  sourceType: "legacy" as const,
  sourceIds: ["item-1"],
  sourceLayerIds: ["memory" as const],
  userApproved: false,
};

describe("export safety", () => {
  it("blocks when export is closed", () => {
    const result = reviewExportCandidate(candidate, { exportEnabled: false, contextPermissions: normalizePassportContextPermissions() });
    expect(result.canExport).toBe(false);
  });

  it("requires user approval", () => {
    const result = reviewExportCandidate(candidate, { exportEnabled: true, contextPermissions: normalizePassportContextPermissions({ allowExportMetadataCloudSync: true, allowMemoryContext: true }) });
    expect(result.canExport).toBe(false);
  });

  it("blocks sealed artifact state", () => {
    const result = reviewExportCandidate({ ...candidate, userApproved: true, privacyLevel: "sealed" as const }, { exportEnabled: true, contextPermissions: normalizePassportContextPermissions({ allowExportMetadataCloudSync: true, allowMemoryContext: true }) });
    expect(result.canExport).toBe(false);
  });

  it("allows approved summary artifact with open permissions", () => {
    const result = reviewExportCandidate({ ...candidate, userApproved: true }, { exportEnabled: true, contextPermissions: normalizePassportContextPermissions({ allowExportMetadataCloudSync: true, allowMemoryContext: true }) });
    expect(result.canExport).toBe(true);
  });
});
