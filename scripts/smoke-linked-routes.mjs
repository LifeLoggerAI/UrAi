const baseUrl = (process.env.PLAYWRIGHT_BASE_URL || process.env.URAI_LIVE_BASE_URL || "http://localhost:3014").replace(/\/$/, "");
const isLive = /^https?:\/\//.test(baseUrl);

const routes = [
  { path: "/", expected: ["URAI", "Own your life"] },
  { path: "/home", expected: ["Own your life"] },
  { path: "/system", expected: ["URAI release truth", "launch"] },
  { path: "/status", expected: ["URAI status", "Preview mode"] },
  { path: "/life-map", expected: ["Life Map"] },
  { path: "/ground", expected: ["URAI Ground World", "Launch safety"] },
  { path: "/xr", expected: ["WebXR", "Launch truth"] },
  { path: "/privacy-controls", expected: ["Privacy"] },
  { path: "/privacy", expected: ["Privacy"] },
  { path: "/terms", expected: ["Terms"] },
  { path: "/dashboard", expected: ["Dashboard", "gated"] },
  { path: "/login", expected: ["Login", "gated"] },
  { path: "/signup", expected: ["Signup", "waitlist"] },
];

const failures = [];

async function checkRoute(route) {
  const url = `${baseUrl}${route.path}`;
  let response;
  try {
    response = await fetch(url, { redirect: "follow" });
  } catch (error) {
    failures.push(`${route.path} fetch failed: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  if (!response.ok) {
    failures.push(`${route.path} returned HTTP ${response.status}`);
    return;
  }

  const text = await response.text();
  const missing = route.expected.filter((marker) => !text.includes(marker));
  if (missing.length) {
    failures.push(`${route.path} missing markers: ${missing.join(", ")}`);
  }
}

for (const route of routes) {
  await checkRoute(route);
}

if (failures.length) {
  console.error(`Linked route smoke failed for ${baseUrl}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Linked route smoke passed for ${baseUrl} (${routes.length} routes).`);

if (isLive) {
  console.log("Live route smoke checks response status and text markers only; deployment SHA, release ID, screenshots, rollback, and monitoring proof must be captured separately.");
}
