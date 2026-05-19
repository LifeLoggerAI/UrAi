export type UraiSystemOwnerId =
  | "route-state-machine"
  | "life-map-state-machine"
  | "camera-controller"
  | "lighting-controller"
  | "animation-controller"
  | "transition-controller"
  | "data-adapter"
  | "permission-layer"
  | "ai-evidence-layer"
  | "analytics-privacy-layer"
  | "asset-manifest"
  | "feature-flags";

export type UraiSystemOwnershipRule = {
  ownerId: UraiSystemOwnerId;
  owns: readonly string[];
  mayMutate: readonly string[];
  mayNotMutate: readonly string[];
  acceptanceRule: string;
};

export const URAI_SOURCE_OF_TRUTH_OWNERS: Record<UraiSystemOwnerId, UraiSystemOwnershipRule> = {
  "route-state-machine": {
    ownerId: "route-state-machine",
    owns: ["current route", "route params", "fallback route", "unwind target"],
    mayMutate: ["route state", "navigation intent"],
    mayNotMutate: ["camera state", "privacy policy", "AI claims", "canonical data"],
    acceptanceRule: "Routes must direct-load, refresh safely, and unwind through the declared route contract.",
  },
  "life-map-state-machine": {
    ownerId: "life-map-state-machine",
    owns: ["selected star", "selected constellation", "life-map filters", "map notices"],
    mayMutate: ["selected spatial entity", "life-map view state"],
    mayNotMutate: ["browser route outside transition controller", "AI claims", "permission policy"],
    acceptanceRule: "Life Map selection must survive direct child routes and invalid IDs must render parent notices.",
  },
  "camera-controller": {
    ownerId: "camera-controller",
    owns: ["camera pose", "lens feeling", "depth of field", "reduced-motion camera branch"],
    mayMutate: ["camera state"],
    mayNotMutate: ["route params", "canonical data", "privacy policy"],
    acceptanceRule: "Camera motion must obey route transition canon and reduced-motion fallback.",
  },
  "lighting-controller": {
    ownerId: "lighting-controller",
    owns: ["moonlight", "bloom", "mist light", "orb response light", "horizon glow"],
    mayMutate: ["lighting state"],
    mayNotMutate: ["route state", "AI claims", "permission policy"],
    acceptanceRule: "Lighting must resolve from visual tokens and never obscure readable UI.",
  },
  "animation-controller": {
    ownerId: "animation-controller",
    owns: ["object motion", "UI fade timing", "input lock timing", "interrupt handling"],
    mayMutate: ["animation state", "interaction lock"],
    mayNotMutate: ["canonical data", "privacy policy", "analytics content"],
    acceptanceRule: "Animations must be interrupt-safe and must not create page-swap flicker.",
  },
  "transition-controller": {
    ownerId: "transition-controller",
    owns: ["route transition phase", "preload timing", "ESC/back handling", "mobile back gesture handling"],
    mayMutate: ["transition state", "route change after safe phase"],
    mayNotMutate: ["AI claims", "permission policy", "asset license metadata"],
    acceptanceRule: "Route updates must happen at declared safe transition phases with loading fallback.",
  },
  "data-adapter": {
    ownerId: "data-adapter",
    owns: ["normalization", "schema version", "source references", "provenance", "lifecycle fields"],
    mayMutate: ["normalized data envelope"],
    mayNotMutate: ["source truth", "privacy override", "AI confirmation state"],
    acceptanceRule: "Every product object must satisfy canonical object validation before use by UI or AI.",
  },
  "permission-layer": {
    ownerId: "permission-layer",
    owns: ["privacyState", "visibilityState", "aiAccessState", "shareability", "archive/delete behavior"],
    mayMutate: ["permission decisions", "visibility decisions"],
    mayNotMutate: ["AI claims", "camera state", "visual route state"],
    acceptanceRule: "Sensitive, vaulted, and deleted states must not be AI-readable by default.",
  },
  "ai-evidence-layer": {
    ownerId: "ai-evidence-layer",
    owns: ["AI suggestions", "evidence references", "confidence", "safety checks"],
    mayMutate: ["draft suggestion state"],
    mayNotMutate: ["user truth", "identity memory without confirmation", "restricted content"],
    acceptanceRule: "AI may suggest with evidence; it may not silently define truth.",
  },
  "analytics-privacy-layer": {
    ownerId: "analytics-privacy-layer",
    owns: ["analytics event shape", "content-free analytics", "deletion audit events"],
    mayMutate: ["privacy-safe event envelope"],
    mayNotMutate: ["private content", "restricted source references", "vault metadata beyond policy"],
    acceptanceRule: "Analytics must follow the permission matrix and avoid private content payloads.",
  },
  "asset-manifest": {
    ownerId: "asset-manifest",
    owns: ["asset variants", "fallback assets", "license/source", "file size budget", "preload policy"],
    mayMutate: ["asset manifest metadata"],
    mayNotMutate: ["route state", "AI claims", "privacy policy"],
    acceptanceRule: "Every production asset must have desktop, mobile, reduced-motion, and fallback variants.",
  },
  "feature-flags": {
    ownerId: "feature-flags",
    owns: ["tier gates", "risky subsystem gates", "safe fallback visibility"],
    mayMutate: ["feature availability"],
    mayNotMutate: ["canonical route existence", "data lifecycle state", "AI evidence rules"],
    acceptanceRule: "No route may 404 because a feature flag is disabled; it must render a safe fallback.",
  },
};

export function assertUraiSourceOfTruthIntegrity(): string[] {
  const failures: string[] = [];

  for (const [ownerId, rule] of Object.entries(URAI_SOURCE_OF_TRUTH_OWNERS)) {
    if (!rule.owns.length) failures.push(`${ownerId} must declare owned state.`);
    if (!rule.mayMutate.length) failures.push(`${ownerId} must declare allowed mutations.`);
    if (!rule.mayNotMutate.length) failures.push(`${ownerId} must declare forbidden mutations.`);
    if (!rule.acceptanceRule) failures.push(`${ownerId} must declare an acceptance rule.`);
  }

  if (!URAI_SOURCE_OF_TRUTH_OWNERS["permission-layer"].owns.includes("privacyState")) {
    failures.push("Permission layer must own privacyState.");
  }

  if (!URAI_SOURCE_OF_TRUTH_OWNERS["ai-evidence-layer"].mayNotMutate.includes("user truth")) {
    failures.push("AI evidence layer must not own user truth.");
  }

  return failures;
}
