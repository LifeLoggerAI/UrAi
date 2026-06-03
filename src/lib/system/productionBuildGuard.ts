import { DEFAULT_FEATURE_FLAGS } from "@/lib/admin/featureFlags";

export type ProductionBuildGuardResult = {
  ok: boolean;
  warnings: string[];
  errors: string[];
};

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

export function runProductionBuildGuard(): ProductionBuildGuardResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const launchStatus = env("NEXT_PUBLIC_URAI_LAUNCH_STATUS") ?? "public_demo";
  const publicDemoEnabled = env("NEXT_PUBLIC_URAI_PUBLIC_DEMO_ENABLED") !== "false";
  const waitlistEnabled = env("NEXT_PUBLIC_URAI_WAITLIST_ENABLED") !== "false";

  if (["public_demo", "waitlist", "beta", "launched"].includes(launchStatus) && !publicDemoEnabled) {
    errors.push("Public demo is disabled while launch status expects a public route.");
  }

  if (["waitlist", "beta", "launched", "public_demo"].includes(launchStatus) && !waitlistEnabled) {
    warnings.push("Waitlist is disabled for a public launch status.");
  }

  if (!env("URAI_ADMIN_EMAILS") && !env("NEXT_PUBLIC_URAI_FOUNDER_EMAILS")) {
    warnings.push("No admin email allowlist is configured. Admin route will deny by default.");
  }

  if (!env("OPENAI_API_KEY")) {
    warnings.push("OPENAI_API_KEY is missing. Companion must use local fallback only.");
  }

  for (const id of ["shadow_enabled", "legacy_enabled", "exports_enabled", "notifications_enabled", "cloud_sync_enabled"] as const) {
    const flag = DEFAULT_FEATURE_FLAGS[id];
    if (flag.defaultEnabled || flag.enabled) errors.push(`${id} must not default on for launch.`);
  }

  return { ok: errors.length === 0, warnings, errors };
}

export function assertProductionBuildGuard(): void {
  if (process.env.NODE_ENV !== "production" && process.env.URAI_STRICT_BUILD_GUARD !== "1") return;
  const result = runProductionBuildGuard();
  for (const warning of result.warnings) console.warn(`[URAI build guard] ${warning}`);
  if (!result.ok) throw new Error(`URAI production build guard failed: ${result.errors.join("; ")}`);
}
