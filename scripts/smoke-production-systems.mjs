#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const liveBaseUrl = normalizeBaseUrl(process.env.LIVE_BASE_URL);

const candidateRoutes = [
  "/",
  "/home",
  "/life-map",
  "/replay",
  "/app/council",
  "/app/marketplace",
  "/app/music-videos",
  "/app/xr",
  "/status",
  "/api/status",
];

const routes = candidateRoutes.filter((route) => route === "/" || routeExists(route));

if (!liveBaseUrl) {
  printRows(
    routes.map((route) => ({
      route,
      status: "unknown",
      http: "skipped",
      note: "LIVE_BASE_URL not set; live smoke not attempted",
    })),
  );
  console.log("\nSet LIVE_BASE_URL=https://www.urai.app to run live production smoke.");
  process.exit(0);
}

const rows = [];
let failed = false;

for (const route of routes) {
  const url = `${liveBaseUrl}${route === "/" ? "/" : route}`;
  try {
    const response = await fetch(url, { method: "GET", redirect: "manual" });
    const text = await response.text().catch(() => "");
    const bodyHasBlocker = /Home experience stalled|Life map is out of orbit|R3F: Div|Unhandled Runtime Error/i.test(text);
    const ok = response.status >= 200 && response.status < 400 && !bodyHasBlocker;
    rows.push({
      route,
      status: ok ? "live" : "blocked",
      http: response.status,
      note: bodyHasBlocker ? "blocker text found in response body" : "HTTP smoke complete",
    });
    if (!ok) failed = true;
  } catch (error) {
    rows.push({
      route,
      status: "blocked",
      http: "fetch_error",
      note: error instanceof Error ? error.message : String(error),
    });
    failed = true;
  }
}

printRows(rows);

if (failed) {
  process.exit(1);
}

function routeExists(route) {
  const candidates = routeToCandidates(route);
  return candidates.some((candidate) => fs.existsSync(path.resolve(root, candidate)));
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

function printRows(rows) {
  const headers = ["route", "status", "http", "note"];
  const widths = Object.fromEntries(
    headers.map((header) => [
      header,
      Math.max(header.length, ...rows.map((row) => String(row[header]).length)),
    ]),
  );
  console.log(headers.map((header) => header.padEnd(widths[header])).join(" | "));
  console.log(headers.map((header) => "-".repeat(widths[header])).join("-|-"));
  for (const row of rows) {
    console.log(headers.map((header) => String(row[header]).padEnd(widths[header])).join(" | "));
  }
}

function normalizeBaseUrl(value) {
  if (!value) return "";
  return value.replace(/\/+$/, "");
}
