export function isSpatialDemoEnabled() {
  return process.env.NEXT_PUBLIC_SPATIAL_DEMO_DISABLED !== "true";
}

export function isSpatialPrivateBetaEnabled() {
  return process.env.NEXT_PUBLIC_SPATIAL_PRIVATE_BETA === "true";
}

export function isSpatialXrEnabled() {
  return process.env.NEXT_PUBLIC_SPATIAL_XR_ENABLED === "true";
}

export function requireSpatialPrivateBeta() {
  if (!isSpatialPrivateBetaEnabled()) {
    return {
      enabled: false,
      status: 403,
      reason: "URAI Spatial authenticated surfaces are feature-flagged until staging smoke, consent, device QA, and asset pipeline checks are green.",
    } as const;
  }

  return {
    enabled: true,
    status: 200,
    reason: "URAI Spatial private beta is enabled.",
  } as const;
}
