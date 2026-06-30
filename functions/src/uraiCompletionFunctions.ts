import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onRequest} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";

const REGION = "us-central1";

type CallableRequestData = Record<string, unknown> | undefined;

type UraiFunctionResult = {
  ok: true;
  functionName: string;
  mode: "callable" | "http" | "scheduled";
  status: "accepted" | "completed";
  requestId?: string;
  generatedAt: string;
};

function requireAuth(contextAuth: {uid?: string} | undefined, functionName: string) {
  if (!contextAuth?.uid) {
    throw new HttpsError("unauthenticated", `${functionName} requires a signed-in URAI user.`);
  }
  return contextAuth.uid;
}

function requireAdmin(contextAuth: {token?: Record<string, unknown>; uid?: string} | undefined, functionName: string) {
  const uid = requireAuth(contextAuth, functionName);
  if (contextAuth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", `${functionName} requires an admin custom claim.`);
  }
  return uid;
}

function stringField(data: CallableRequestData, field: string, maxLength = 4000) {
  const value = data?.[field];
  if (typeof value !== "string" || value.trim().length === 0 || value.length > maxLength) {
    throw new HttpsError("invalid-argument", `${field} must be a non-empty string up to ${maxLength} characters.`);
  }
  return value.trim();
}

function optionalStringField(data: CallableRequestData, field: string, maxLength = 4000) {
  const value = data?.[field];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || value.length > maxLength) {
    throw new HttpsError("invalid-argument", `${field} must be a string up to ${maxLength} characters.`);
  }
  return value.trim();
}

function accepted(functionName: string, mode: UraiFunctionResult["mode"], requestId?: string): UraiFunctionResult {
  logger.info("urai.function.accepted", {functionName, mode, requestId});
  return {
    ok: true,
    functionName,
    mode,
    status: "accepted",
    requestId,
    generatedAt: new Date().toISOString(),
  };
}

function makeUserCallable(functionName: string, validator?: (data: CallableRequestData) => string | undefined) {
  return onCall({region: REGION}, async (request) => {
    requireAuth(request.auth, functionName);
    const requestId = validator?.(request.data as CallableRequestData);
    return accepted(functionName, "callable", requestId);
  });
}

function makeAdminCallable(functionName: string, validator?: (data: CallableRequestData) => string | undefined) {
  return onCall({region: REGION}, async (request) => {
    requireAdmin(request.auth, functionName);
    const requestId = validator?.(request.data as CallableRequestData);
    return accepted(functionName, "callable", requestId);
  });
}

function makeScheduled(functionName: string, schedule: string) {
  return onSchedule({region: REGION, schedule, timeZone: "America/Chicago"}, async () => {
    accepted(functionName, "scheduled");
  });
}

export const dailyGenerateInsights = makeScheduled("dailyGenerateInsights", "every day 03:15");
export const weeklyRecap = makeScheduled("weeklyRecap", "every monday 04:30");
export const rollupDaily = makeScheduled("rollupDaily", "every day 02:30");
export const exportGC = makeScheduled("exportGC", "every day 05:45");
export const notificationDispatch = makeScheduled("notificationDispatch", "every 15 minutes");

export const requestExport = makeUserCallable("requestExport", (data) => optionalStringField(data, "format", 64));
export const exportWorker = makeAdminCallable("exportWorker", (data) => stringField(data, "exportId", 256));
export const storyOutline = makeUserCallable("storyOutline", (data) => optionalStringField(data, "storyProjectId", 256));
export const storyAssemble = makeUserCallable("storyAssemble", (data) => stringField(data, "storyProjectId", 256));
export const ttsRender = makeUserCallable("ttsRender", (data) => stringField(data, "storyAssetId", 256));
export const purchaseWebhook = makeAdminCallable("purchaseWebhook", (data) => optionalStringField(data, "eventId", 256));
export const syncEntitlements = makeUserCallable("syncEntitlements");
export const marketplaceUnlock = makeUserCallable("marketplaceUnlock", (data) => stringField(data, "marketplaceItemId", 256));
export const referralTrack = makeUserCallable("referralTrack", (data) => optionalStringField(data, "code", 128));
export const dataExportRequest = makeUserCallable("dataExportRequest", (data) => optionalStringField(data, "reason", 500));
export const accountDeletionRequest = makeUserCallable("accountDeletionRequest", (data) => stringField(data, "confirmation", 128));
export const adminAuditLog = makeAdminCallable("adminAuditLog", (data) => stringField(data, "action", 256));
export const safetyEventCreate = makeUserCallable("safetyEventCreate", (data) => stringField(data, "safetyLevel", 64));

export const cleanupExpiredExports = onCall({region: REGION}, async (request) => {
  requireAdmin(request.auth, "cleanupExpiredExports");
  logger.info("urai.function.gated", {functionName: "cleanupExpiredExports", mode: "callable"});
  throw new HttpsError(
    "failed-precondition",
    "cleanupExpiredExports is intentionally gated until export retention rules and dry-run tests are production-verified."
  );
});

export const rollupDailyMetrics = onCall({region: REGION}, async (request) => {
  requireAdmin(request.auth, "rollupDailyMetrics");
  logger.info("urai.function.gated", {functionName: "rollupDailyMetrics", mode: "callable"});
  throw new HttpsError(
    "failed-precondition",
    "rollupDailyMetrics is intentionally gated until metrics schemas and dry-run aggregation tests are production-verified."
  );
});

export const jobApplicationSubmit = makeUserCallable("jobApplicationSubmit", (data) => {
  stringField(data, "jobId", 256);
  stringField(data, "applicantEmail", 320);
  return optionalStringField(data, "applicationId", 256);
});

export const contactSubmit = makeUserCallable("contactSubmit", (data) => {
  stringField(data, "email", 320);
  return optionalStringField(data, "message", 4000);
});

export const waitlistSubmit = makeUserCallable("waitlistSubmit", (data) => {
  stringField(data, "email", 320);
  return optionalStringField(data, "source", 256);
});

export const health = onRequest({region: REGION}, (_request, response) => {
  response.status(200).json({
    ok: true,
    service: "urai-functions",
    status: "healthy"
  });
});

export const systemStatusCheck = onCall({region: REGION}, async (request) => {
  requireAdmin(request.auth, "systemStatusCheck");
  logger.info("urai.function.accepted", {functionName: "systemStatusCheck", mode: "callable"});
  return {
    ok: true,
    service: "urai-functions",
    functionName: "systemStatusCheck",
    status: "healthy",
    scope: "operator",
    generatedAt: new Date().toISOString(),
  };
});
