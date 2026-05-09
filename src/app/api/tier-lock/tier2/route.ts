import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { evaluateTierLock } from "@/lib/tier-locks/evaluateTierLock";
import { TIER2_FEATURES } from "@/lib/tier-locks/config";
import type { ConsentSource, TierLockFeatureId, TierLockUserContext, UraiTier } from "@/lib/tier-locks/types";

type Tier2AccessLockRequest = {
  featureId?: unknown;
};

type UserProfile = {
  entitlementTier?: UraiTier;
  roles?: string[];
};

const VALID_TIERS: UraiTier[] = ["tier1", "tier2", "tier3", "tier4", "tier5"];

function isTierLockFeatureId(value: unknown): value is TierLockFeatureId {
  return typeof value === "string" && value in TIER2_FEATURES;
}

function asTier(value: unknown): UraiTier | null {
  return typeof value === "string" && VALID_TIERS.includes(value as UraiTier) ? (value as UraiTier) : null;
}

function getBearerToken(req: Request): string | null {
  const authorization = req.headers.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

function normalizeStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

async function verifyUid(req: Request): Promise<string | null> {
  const auth = getAdminAuth();
  const token = getBearerToken(req);
  if (!auth || !token) return null;

  try {
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

async function buildUserContext(uid: string | null, featureId: TierLockFeatureId): Promise<TierLockUserContext> {
  if (!uid) return {};

  const db = getAdminDb();
  if (!db) return { uid };

  const feature = TIER2_FEATURES[featureId];
  const [userSnap, featureSnap] = await Promise.all([
    db.collection("users").doc(uid).get(),
    db.collection("features").doc(feature.flagId).get(),
  ]);

  const userData = (userSnap.exists ? userSnap.data() : {}) as UserProfile;
  const roles = normalizeStringList(userData.roles);
  const entitlementTier = asTier(userData.entitlementTier) ?? "tier1";
  const isAdminOverride = roles.includes("admin") || roles.includes("internal");

  const consentSnaps = await Promise.all(
    feature.requiredConsents.map(async (source) => {
      const snap = await db.collection("users").doc(uid).collection("consents").doc(source).get();
      return { source, accepted: snap.exists && snap.data()?.status === "accepted" };
    })
  );

  const acceptedConsents = consentSnaps
    .filter((row): row is { source: ConsentSource; accepted: true } => row.accepted)
    .map((row) => row.source);

  const featureData = featureSnap.exists ? featureSnap.data() : null;
  const enabledFeatureFlags = featureData?.enabled === true ? [feature.flagId] : [];

  return {
    uid,
    entitlementTier,
    acceptedConsents,
    enabledFeatureFlags,
    isAdminOverride,
  };
}

async function auditTierLock(uid: string | null, result: ReturnType<typeof evaluateTierLock>) {
  if (!result.shouldAudit) return;

  const db = getAdminDb();
  if (!db) return;

  await db.collection("auditLogs").add({
    ownerUid: uid,
    type: "tier2_access_lock",
    featureId: result.featureId,
    decision: result.decision,
    reason: result.reason,
    effectiveTier: result.effectiveTier,
    createdAt: new Date().toISOString(),
  });
}

async function evaluateTier2AccessLock(req: Request, featureId: TierLockFeatureId) {
  const uid = await verifyUid(req);
  const user = await buildUserContext(uid, featureId);
  const result = evaluateTierLock({ featureId, user });
  await auditTierLock(uid, result);

  return NextResponse.json({
    ok: true,
    mode: isFirebaseAdminConfigured() ? "firebase-admin" : "dry-run",
    result,
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Tier2AccessLockRequest;
    if (!isTierLockFeatureId(body.featureId)) {
      return NextResponse.json({ error: "A valid Tier-2 featureId is required." }, { status: 400 });
    }

    return evaluateTier2AccessLock(req, body.featureId);
  } catch {
    return NextResponse.json({ error: "Unable to evaluate Tier-2 access lock." }, { status: 400 });
  }
}
