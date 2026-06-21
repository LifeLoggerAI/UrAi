const base = process.env.URAI_LIVE_URL || "https://urai-4dc1d.web.app";

const routeChecks = [
  ["/", "Step inside"],
  ["/home", "Genesis assets live"],
  ["/demo", "Genesis assets live"],
  ["/life-map", "Genesis assets live"],
  ["/status", "Public shell live"],
  ["/waitlist", "Hold your place"],
  ["/privacy", "Privacy posture"],
  ["/terms", "Terms preview"],
  ["/robots.txt", "User-agent"],
  ["/sitemap.xml", "<urlset"],
  ["/assets/manifest.json", "curated-urai-asset-dropin"],
  ["/assets/asset-manifest.js", "URAI_STATIC_ASSETS"],
];

async function readText(path) {
  const url = base + path;
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  return { url, status: res.status, text };
}

(async () => {
  let failed = false;

  for (const [path, needle] of routeChecks) {
    try {
      const { url, status, text } = await readText(path);
      const ok = status === 200 && text.includes(needle);
      console.log(`${ok ? "OK" : "BAD"} ${status} ${url} NEEDLE=${needle}`);
      if (!ok) failed = true;
    } catch (err) {
      failed = true;
      console.log(`ERROR ${base + path} ${err.message}`);
    }
  }

  try {
    const manifestResponse = await fetch(base + "/assets/manifest.json", { redirect: "follow" });
    const manifest = await manifestResponse.json();
    const count = Number(manifest.count || 0);
    console.log(`LIVE_ASSET_COUNT=${count}`);
    console.log(`LIVE_ASSET_TYPES=${JSON.stringify(manifest.byType || {})}`);
    if (manifest.launchMode !== "curated-urai-asset-dropin" || count < 48) {
      failed = true;
      console.log("BAD_ASSET_MANIFEST=1");
    }
  } catch (err) {
    failed = true;
    console.log(`ERROR_ASSET_MANIFEST ${err.message}`);
  }

  console.log("");
  if (failed) {
    console.log("FREE_STATIC_LIVE_VERIFY_FAILED=1");
    process.exit(1);
  }

  console.log("FREE_STATIC_LIVE_VERIFY_GREEN=1");
  console.log("CURATED_STATIC_ASSET_LAYER_GREEN=1");
  console.log(`LIVE_URL=${base}`);
})();
