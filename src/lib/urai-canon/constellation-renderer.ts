export type UraiConstellationViewport = "mobile" | "tablet" | "desktop";
export type UraiConstellationLod = "minimal" | "balanced" | "dense";

export type UraiConstellationRenderBudget = {
  viewport: UraiConstellationViewport;
  maxBackgroundStars: number;
  maxInteractiveStars: number;
  maxConstellationLines: number;
  maxNebulaBands: number;
  targetRenderMs: number;
  maxMemoryMb: number;
};

export const URAI_CONSTELLATION_RENDER_BUDGETS: Record<UraiConstellationViewport, UraiConstellationRenderBudget> = {
  mobile: {
    viewport: "mobile",
    maxBackgroundStars: 110,
    maxInteractiveStars: 4,
    maxConstellationLines: 14,
    maxNebulaBands: 2,
    targetRenderMs: 120,
    maxMemoryMb: 256,
  },
  tablet: {
    viewport: "tablet",
    maxBackgroundStars: 180,
    maxInteractiveStars: 6,
    maxConstellationLines: 24,
    maxNebulaBands: 3,
    targetRenderMs: 140,
    maxMemoryMb: 320,
  },
  desktop: {
    viewport: "desktop",
    maxBackgroundStars: 260,
    maxInteractiveStars: 7,
    maxConstellationLines: 36,
    maxNebulaBands: 4,
    targetRenderMs: 160,
    maxMemoryMb: 384,
  },
};

export function resolveConstellationLod(starCount: number, viewport: UraiConstellationViewport): UraiConstellationLod {
  const budget = URAI_CONSTELLATION_RENDER_BUDGETS[viewport];
  if (starCount <= budget.maxInteractiveStars) return "minimal";
  if (starCount <= budget.maxBackgroundStars / 2) return "balanced";
  return "dense";
}

export function assertUraiConstellationRendererIntegrity(): string[] {
  const failures: string[] = [];
  for (const [viewport, budget] of Object.entries(URAI_CONSTELLATION_RENDER_BUDGETS)) {
    if (budget.viewport !== viewport) failures.push(`Viewport mismatch: ${viewport}`);
    if (budget.maxBackgroundStars <= 0) failures.push(`No background stars budget for ${viewport}`);
    if (budget.maxInteractiveStars > 7) failures.push(`Too many interactive stars for ${viewport}`);
    if (budget.targetRenderMs > 160) failures.push(`Render budget too slow for ${viewport}`);
    if (budget.maxMemoryMb > 384) failures.push(`Memory budget too high for ${viewport}`);
  }
  if (URAI_CONSTELLATION_RENDER_BUDGETS.mobile.maxBackgroundStars >= URAI_CONSTELLATION_RENDER_BUDGETS.desktop.maxBackgroundStars) {
    failures.push("Mobile star budget must stay below desktop budget.");
  }
  return failures;
}
