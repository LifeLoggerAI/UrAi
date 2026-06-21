const paths = [
  ["/", "Step inside"],
  ["/home", "Step inside"],
  ["/demo", "Walk the first"],
  ["/life-map", "navigable world"],
  ["/status", "Public shell live"],
  ["/waitlist", "Hold your place"],
  ["/privacy", "Privacy posture"],
  ["/terms", "Terms preview"],
  ["/robots.txt", "User-agent"],
  ["/sitemap.xml", "<urlset"],
];

const base = process.env.URAI_LIVE_URL || "https://urai-4dc1d.web.app";

(async () => {
  let failed = false;

  for (const [path, needle] of paths) {
    const url = base + path;
    try {
      const res = await fetch(url, { redirect: "follow" });
      const text = await res.text();
      const ok = res.status === 200 && text.includes(needle);
      console.log(`${ok ? "OK" : "BAD"} ${res.status} ${url} NEEDLE=${needle}`);
      if (!ok) failed = true;
    } catch (err) {
      failed = true;
      console.log(`ERROR ${url} ${err.message}`);
    }
  }

  console.log("");
  if (failed) {
    console.log("FREE_STATIC_LIVE_VERIFY_FAILED=1");
    process.exit(1);
  }

  console.log("FREE_STATIC_LIVE_VERIFY_GREEN=1");
  console.log(`LIVE_URL=${base}`);
})();
