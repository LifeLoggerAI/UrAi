#!/usr/bin/env node
const baseUrl = process.env.HOME_XR_LIVE_URL || process.env.PLAYWRIGHT_BASE_URL || process.env.URAI_LIVE_URL;
const requiredPaths = ["/", "/home", "/xr", "/life-map"];

function fail(message) {
  console.error(`home-xr-live-url: ${message}`);
  process.exitCode = 1;
}

function normalizeBaseUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && !url.hostname.includes("localhost")) {
      fail(`base URL must be HTTPS or localhost, got ${url.origin}`);
    }
    return url.origin;
  } catch {
    fail(`invalid HOME_XR_LIVE_URL/PLAYWRIGHT_BASE_URL/URAI_LIVE_URL: ${value}`);
    return null;
  }
}

async function checkPath(origin, routePath) {
  const url = `${origin}${routePath}`;
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "urai-home-xr-live-smoke/1.0",
    },
  });

  if (!response.ok) {
    fail(`${url} returned HTTP ${response.status}`);
    return;
  }

  const body = await response.text();
  if (routePath === "/home") {
    if (!body.includes("Own your life") && !body.includes("__next")) {
      fail("/home response did not look like the Next app shell or Home page");
    }
    if (/Quest ready|VR ready|production XR|full Quest support/i.test(body)) {
      fail("/home live copy contains an unverified Quest/VR/XR readiness claim");
    }
  }

  console.log(`[PASS] ${url} -> HTTP ${response.status}`);
}

const origin = normalizeBaseUrl(baseUrl);
if (!origin) {
  fail("set HOME_XR_LIVE_URL, PLAYWRIGHT_BASE_URL, or URAI_LIVE_URL before running live URL smoke");
  process.exit(process.exitCode ?? 1);
}

for (const routePath of requiredPaths) {
  await checkPath(origin, routePath);
}

if (process.exitCode) process.exit(process.exitCode);
console.log("home-xr-live-url: deployed route smoke passed");
