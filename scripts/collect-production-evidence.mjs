#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const liveBaseUrl = normalizeBaseUrl(process.env.LIVE_BASE_URL);

const evidenceFields = [
  "productionClaimAllowed",
  "liveDeployEvidence",
  "liveSmokeEvidence",
  "privacyReviewEvidence",
  "rollbackEvidence",
];

const systems = [
  {
    id: "genesis-demo",
    label: "Genesis demo",
    evidenceFile: "genesis-demo.md",
    defaultStatus: "preview",
    routes: ["/", "/home", "/life-map", "/replay", "/focus", "/passport", "/waitlist"],
    apiRoutes: ["/api/status", "/api/waitlist"],
    docs: [
      "docs/GENESIS_LAUNCH_PROOF.md",
      "docs/PRODUCTION_CLAIMS_RELEASE_GATE.md",
      "docs/WHAT_CAN_BE_CLAIMED_LIVE.md",
    ],
    tests: ["tests/unit/genesis-onboarding-film.test.tsx"],
    scripts: ["check:genesis", "verify:privacy", "build"],
    env: [],
  },
  {
    id: "life-movie",
    label: "Life movie generation",
    evidenceFile: "life-movie.md",
    defaultStatus: "gated",
    routes: ["/replay", "/app/life-map/replay"],
    apiRoutes: [
      "/api/life-movies",
      "/api/life-movies/[lifeMovieId]",
      "/api/life-movies/[lifeMovieId]/render",
    ],
    docs: [
      "docs/LIFE_MOVIE_SYSTEM_CONTRACT.md",
      "docs/LIFE_MOVIE_MVP_RELEASE_GATE.md",
      "docs/LIFE_MOVIE_E2E_MVP.md",
    ],
    tests: [
      "tests/unit/life-movie-system-contract.test.ts",
      "tests/unit/life-movie-e2e-mvp.test.ts",
      "tests/rules/life-movie.rules.test.js",
    ],
    scripts: ["check:types", "test:rules"],
    env: ["URAI_ENABLE_LIFE_MOVIE_JOBS", "ASSET_FACTORY_ENABLED"],
  },
  {
    id: "xr-memory-worlds",
    label: "XR memory worlds",
    evidenceFile: "xr-memory-worlds.md",
    legacyEvidenceFile: "xr.md",
    defaultStatus: "disabled",
    routes: ["/app/xr", "/spatial", "/spatial/demo", "/spatial/assets"],
    apiRoutes: [
      "/api/xr/worlds",
      "/api/xr/worlds/[worldId]",
      "/api/xr/worlds/[worldId]/generate",
      "/api/xr/device-capabilities",
    ],
    docs: ["docs/XR_MEMORY_WORLD_CONTRACT.md", "docs/XR_RELEASE_GATE.md"],
    tests: [
      "tests/unit/xr-memory-world-system-contract.test.ts",
      "tests/rules/xr-memory-world.rules.test.js",
    ],
    scripts: ["check:genesis", "test:rules"],
    env: ["URAI_XR_ENABLED", "URAI_ENABLE_XR_WORLD_JOBS", "ASSET_FACTORY_ENABLED"],
  },
  {
    id: "passive-sensing",
    label: "Passive sensing",
    evidenceFile: "passive-sensing.md",
    defaultStatus: "disabled",
    routes: ["/settings/privacy", "/app/settings/privacy", "/passport"],
    apiRoutes: [
      "/api/consents",
      "/api/consents/[source]/grant",
      "/api/consents/[source]/revoke",
      "/api/passive-signals/ingest",
    ],
    docs: [
      "docs/PASSIVE_SENSING_PRIVACY_MODEL.md",
      "docs/CONSENT_AND_REVOCATION_MODEL.md",
      "docs/PASSIVE_SENSING_RELEASE_GATE.md",
    ],
    tests: [
      "tests/unit/passive-sensing-contract.test.ts",
      "tests/rules/passive-sensing.rules.test.js",
    ],
    scripts: ["verify:privacy", "test:rules"],
    env: ["URAI_LIVE_PASSIVE_SENSING_ENABLED", "URAI_ENABLE_PASSIVE_SIGNAL_JOBS"],
  },
  {
    id: "data-marketplace",
    label: "Data marketplace",
    evidenceFile: "data-marketplace.md",
    defaultStatus: "disabled",
    routes: ["/app/marketplace"],
    apiRoutes: [
      "/api/marketplace/participation",
      "/api/marketplace/participation/opt-in",
      "/api/marketplace/participation/revoke",
      "/api/marketplace/products",
      "/api/admin/marketplace/aggregates",
    ],
    docs: [
      "docs/DATA_MARKETPLACE_PRIVACY_MODEL.md",
      "docs/DATA_MARKETPLACE_PRODUCT_CONTRACT.md",
      "docs/DATA_MARKETPLACE_RELEASE_GATE.md",
    ],
    tests: [
      "tests/unit/data-marketplace-contract.test.ts",
      "tests/rules/data-marketplace.rules.test.js",
    ],
    scripts: ["verify:privacy", "test:rules"],
    env: [
      "URAI_DATA_MARKETPLACE_ENABLED",
      "URAI_DATA_MARKETPLACE_AGGREGATION_ENABLED",
      "URAI_ENABLE_DATA_MARKETPLACE_JOBS",
    ],
  },
  {
    id: "autonomous-jobs",
    label: "Autonomous jobs",
    evidenceFile: "autonomous-jobs.md",
    legacyEvidenceFile: "jobs.md",
    defaultStatus: "gated",
    routes: [],
    apiRoutes: [
      "/api/jobs",
      "/api/jobs/[jobId]",
      "/api/jobs/[jobId]/cancel",
      "/api/admin/jobs/[jobId]/retry",
      "/api/admin/jobs/[jobId]/dead-letter",
    ],
    docs: ["docs/JOB_SYSTEM_CONTRACT.md", "docs/JOB_API_CONTRACT.md", "docs/JOB_SECURITY_MODEL.md"],
    tests: ["tests/unit/job-system-contract.test.ts", "tests/rules/job-system.rules.test.js"],
    scripts: ["test:rules", "check:production-claims"],
    env: ["URAI_WORKER_SERVICE_URL", "URAI_WORKER_SHARED_SECRET"],
  },
  {
    id: "ai-council",
    label: "AI council governance",
    evidenceFile: "ai-council.md",
    legacyEvidenceFile: "council.md",
    defaultStatus: "gated",
    routes: ["/app/council"],
    apiRoutes: [
      "/api/council/sessions",
      "/api/council/sessions/[sessionId]",
      "/api/council/sessions/[sessionId]/messages",
      "/api/council/sessions/[sessionId]/review",
    ],
    docs: [
      "docs/AI_COUNCIL_GOVERNANCE_CONTRACT.md",
      "docs/AI_COUNCIL_POLICY_MODEL.md",
      "docs/AI_COUNCIL_RELEASE_GATE.md",
    ],
    tests: [
      "tests/unit/ai-council-governance.test.ts",
      "tests/rules/ai-council-governance.rules.test.js",
    ],
    scripts: ["verify:privacy", "test:rules"],
    env: ["OPENAI_API_KEY", "URAI_ENABLE_COUNCIL_REVIEW_JOBS"],
  },
  {
    id: "music-video",
    label: "Music video generation",
    evidenceFile: "music-video.md",
    defaultStatus: "gated",
    routes: ["/app/music-videos", "/app/music-videos/new"],
    apiRoutes: [
      "/api/music-videos",
      "/api/music-videos/[projectId]",
      "/api/music-videos/[projectId]/render",
    ],
    docs: [
      "docs/MUSIC_VIDEO_SYSTEM_CONTRACT.md",
      "docs/MUSIC_VIDEO_SAFETY_AND_RIGHTS.md",
      "docs/MUSIC_VIDEO_RELEASE_GATE.md",
    ],
    tests: [
      "tests/unit/music-video-system-contract.test.ts",
      "tests/rules/music-video.rules.test.js",
    ],
    scripts: ["check:production-claims", "test:rules"],
    env: ["URAI_ENABLE_MUSIC_VIDEO_JOBS", "ASSET_FACTORY_ENABLED"],
  },
  {
    id: "asset-factory",
    label: "Asset Factory integration",
    evidenceFile: "asset-factory.md",
    defaultStatus: "disabled",
    routes: [],
    apiRoutes: [
      "/api/internal/jobs/[jobId]/dispatch-asset-factory",
      "/api/internal/asset-factory/callback",
    ],
    docs: ["docs/ASSET_FACTORY_INTEGRATION.md", "docs/ASSET_FACTORY_PROVIDER_CONTRACT.md", "docs/GENERATED_MEDIA_STORAGE_POLICY.md"],
    tests: ["tests/unit/asset-factory-adapter.test.ts"],
    scripts: ["check:production-claims", "build"],
    env: [
      "ASSET_FACTORY_ENABLED",
      "ASSET_FACTORY_BASE_URL",
      "ASSET_FACTORY_API_KEY",
      "ASSET_FACTORY_CALLBACK_SECRET",
      "ASSET_FACTORY_CALLBACK_URL",
    ],
  },
  {
    id: "admin-console",
    label: "Admin console",
    evidenceFile: "admin-console.md",
    defaultStatus: "gated",
    routes: ["/admin", "/admin/marketplace", "/app/council"],
    apiRoutes: ["/api/admin/status", "/api/admin/marketplace/reviews"],
    docs: ["docs/JOB_SECURITY_MODEL.md", "docs/PRODUCTION_SYSTEMS_RELEASE_GATES.md"],
    tests: ["tests/rules/job-system.rules.test.js"],
    scripts: ["test:rules", "verify:privacy"],
    env: ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"],
  },
];

const packageJson = readJson("package.json") ?? { scripts: {} };
const rows = [];
const failures = [];
let liveSmokeByRoute = new Map();

if (liveBaseUrl) {
  liveSmokeByRoute = await smokeRoutes(
    unique(systems.flatMap((system) => system.routes)),
    liveBaseUrl,
  );
}

for (const system of systems) {
  const checks = collectSystemChecks(system);
  const status = classify(system, checks);
  const routeSummary = summarizeChecks(checks.routes);
  const apiSummary = summarizeChecks(checks.apiRoutes);
  const envSummary = summarizeEnv(checks.env);
  const note = buildNote(system, status, checks);

  rows.push({
    system: system.id,
    status,
    routes: routeSummary,
    api: apiSummary,
    env: envSummary,
    evidence: checks.evidence.exists ? relative(checks.evidence.path) : "missing",
    note,
  });

  if (status === "blocked") {
    failures.push(`${system.id}: ${note}`);
  }
}

printRows(rows);

const liveSystems = rows.filter((row) => row.status === "live").map((row) => row.system);
const claimable = liveSystems.length > 0 ? liveSystems.join(", ") : "none";
console.log(`\nclaimable-live-systems: ${claimable}`);
console.log(
  "live-definition: code path + feature flag/provider/env + complete evidence + deployed smoke proof",
);

if (failures.length > 0) {
  console.error("\nblocked systems:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function collectSystemChecks(system) {
  const evidence = readEvidence(system);
  const routes = system.routes.map((route) => ({
    route,
    exists: routeExists(route),
    smoke: liveSmokeByRoute.get(route),
  }));
  const apiRoutes = system.apiRoutes.map((route) => ({
    route,
    exists: routeExists(route),
  }));
  const docs = system.docs.map((doc) => ({ path: doc, exists: fileExists(doc) }));
  const tests = system.tests.map((test) => ({ path: test, exists: fileExists(test) }));
  const scripts = system.scripts.map((script) => ({
    name: script,
    exists: Boolean(packageJson.scripts?.[script]),
  }));
  const env = system.env.map((name) => ({
    name,
    present: Boolean(process.env[name]),
    enabled: process.env[name] === "true",
  }));

  return { evidence, routes, apiRoutes, docs, tests, scripts, env };
}

function classify(system, checks) {
  const missingRequired = [
    ...checks.routes.filter((item) => !item.exists).map((item) => item.route),
    ...checks.apiRoutes.filter((item) => !item.exists).map((item) => item.route),
    ...checks.docs.filter((item) => !item.exists).map((item) => item.path),
    ...checks.tests.filter((item) => !item.exists).map((item) => item.path),
    ...checks.scripts.filter((item) => !item.exists).map((item) => `script:${item.name}`),
  ];

  if (!checks.evidence.exists) return "blocked";
  if (missingRequired.length > 0) return "blocked";

  const allSmokePassed =
    liveBaseUrl &&
    checks.routes.length > 0 &&
    checks.routes.every((item) => item.smoke?.ok === true);
  const requiredEnvPresent = checks.env.every((item) => item.present);
  const evidenceAllowsLive = checks.evidence.allowsProductionClaim;

  if (evidenceAllowsLive && requiredEnvPresent && allSmokePassed) {
    return "live";
  }

  if (system.defaultStatus === "disabled") return "disabled";
  if (system.defaultStatus === "preview") return "preview";
  if (system.defaultStatus === "gated") return "gated";

  return "unknown";
}

function buildNote(system, status, checks) {
  if (!checks.evidence.exists) {
    return `missing evidence file ${relative(checks.evidence.path)}`;
  }

  const missing = [
    ...checks.routes.filter((item) => !item.exists).map((item) => item.route),
    ...checks.apiRoutes.filter((item) => !item.exists).map((item) => item.route),
    ...checks.docs.filter((item) => !item.exists).map((item) => item.path),
    ...checks.tests.filter((item) => !item.exists).map((item) => item.path),
    ...checks.scripts.filter((item) => !item.exists).map((item) => `script:${item.name}`),
  ];

  if (missing.length > 0) {
    return `missing required evidence inputs: ${missing.slice(0, 4).join(", ")}${missing.length > 4 ? "..." : ""}`;
  }

  if (status === "live") return "complete evidence and live smoke passed";

  const missingEnv = checks.env.filter((item) => !item.present).map((item) => item.name);
  const evidenceMissing = checks.evidence.missing.join(", ");
  const smokeNote = liveBaseUrl ? "live smoke not complete" : "LIVE_BASE_URL not set";
  const envNote = missingEnv.length > 0 ? `missing env: ${missingEnv.join(", ")}` : "env present or not required";

  return `${system.defaultStatus}; ${envNote}; evidence incomplete: ${evidenceMissing || "none"}; ${smokeNote}`;
}

function readEvidence(system) {
  const primary = path.resolve(root, "docs/PRODUCTION_EVIDENCE", system.evidenceFile);
  const legacy = system.legacyEvidenceFile
    ? path.resolve(root, "docs/PRODUCTION_EVIDENCE", system.legacyEvidenceFile)
    : undefined;
  const evidencePath = fs.existsSync(primary) ? primary : legacy;

  if (!evidencePath || !fs.existsSync(evidencePath)) {
    return {
      exists: false,
      path: primary,
      allowsProductionClaim: false,
      missing: ["file"],
    };
  }

  const content = fs.readFileSync(evidencePath, "utf8");
  const missing = evidenceFields.filter((field) => !hasUsableEvidenceField(content, field));
  return {
    exists: true,
    path: evidencePath,
    allowsProductionClaim: /productionClaimAllowed\s*:\s*true/i.test(content) && missing.length === 0,
    missing,
  };
}

function hasUsableEvidenceField(content, field) {
  const match = content.match(new RegExp(`^${escapeRegExp(field)}\\s*:\\s*(.+)$`, "im"));
  if (!match) return false;
  const value = match[1].trim().replace(/^['"]|['"]$/g, "").toLowerCase();
  return Boolean(value && !["false", "no", "none", "missing", "tbd", "todo", "n/a"].includes(value));
}

async function smokeRoutes(routes, baseUrl) {
  const results = new Map();
  for (const route of routes) {
    const url = `${baseUrl}${route === "/" ? "/" : route}`;
    try {
      const response = await fetch(url, { method: "GET", redirect: "manual" });
      const text = await response.text().catch(() => "");
      const bodyHasBlocker = /Home experience stalled|Life map is out of orbit|R3F: Div|Unhandled Runtime Error/i.test(text);
      results.set(route, {
        ok: response.status >= 200 && response.status < 400 && !bodyHasBlocker,
        status: response.status,
        bodyHasBlocker,
      });
    } catch (error) {
      results.set(route, {
        ok: false,
        status: "fetch_error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return results;
}

function routeExists(route) {
  const candidates = routeToCandidates(route);
  return candidates.some((candidate) => fileExists(candidate));
}

function routeToCandidates(route) {
  if (route === "/") return ["src/app/page.tsx", "src/app/page.ts", "src/app/route.ts"];
  const segments = route.split("/").filter(Boolean);
  return [
    path.join("src/app", ...segments, "page.tsx"),
    path.join("src/app", ...segments, "page.ts"),
    path.join("src/app", ...segments, "route.ts"),
  ];
}

function summarizeChecks(items) {
  if (items.length === 0) return "n/a";
  const present = items.filter((item) => item.exists).length;
  return `${present}/${items.length}`;
}

function summarizeEnv(items) {
  if (items.length === 0) return "n/a";
  const present = items.filter((item) => item.present).length;
  return `${present}/${items.length}`;
}

function printRows(rows) {
  const headers = ["system", "status", "routes", "api", "env", "evidence", "note"];
  const widths = Object.fromEntries(
    headers.map((header) => [
      header,
      Math.max(header.length, ...rows.map((row) => String(row[header]).length)),
    ]),
  );
  const line = headers.map((header) => header.padEnd(widths[header])).join(" | ");
  const divider = headers.map((header) => "-".repeat(widths[header])).join("-|-");
  console.log(line);
  console.log(divider);
  for (const row of rows) {
    console.log(headers.map((header) => String(row[header]).padEnd(widths[header])).join(" | "));
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(root, filePath), "utf8"));
  } catch {
    return undefined;
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.resolve(root, filePath));
}

function normalizeBaseUrl(value) {
  if (!value) return "";
  return value.replace(/\/+$/, "");
}

function unique(values) {
  return [...new Set(values)];
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

