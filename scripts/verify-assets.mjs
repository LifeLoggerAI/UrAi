import fs from "node:fs";
import path from "node:path";

const criticalAssets = [
  "public/og/urai-genesis-preview.png",
  "public/og/urai-public-demo.svg",
  "public/icon.svg",
  "public/site.webmanifest",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/assets/genesis/hero/urai-genesis-hero-1600x1000.png",
  "public/assets/genesis/orb/orb-core.png",
  "public/assets/genesis/orb/orb-glow.png",
  "public/assets/genesis/life-map/life-map-background-1600x1000.png",
  "public/assets/genesis/life-map/life-map-card-memory-sample.png",
  "public/assets/genesis/memory-film/memory-film-preview-sample.png",
  "public/assets/genesis/passport/passport-privacy-card.png",
  "public/assets/genesis/privacy/consent-shield-card.png",
  "public/assets/genesis/spatial/spatial-xr-preview-sample.png",
  "public/assets/genesis/fallbacks/media-thumbnail-sample.png",
  "public/genesis/onboarding/final-manifest.json",
  "public/assets/sky/bloom/fallback-sky-bloom-12.webp",
  "public/assets/images/genesis-orb-placeholder.svg",
  "public/assets/ground/bloom/fallback-ground-bloom-12.png",
];

const optionalAssets = [
  "public/assets/genesis/portals/galaxy-portal.png",
  "public/assets/genesis/portals/mirror-portal.png",
  "public/assets/genesis/portals/shadow-portal.png",
  "public/assets/genesis/portals/legacy-portal.png",
  "public/assets/genesis/portals/passport-portal.png",
  "public/assets/audio/voice/genesis/orb/tap.wav",
  "public/assets/audio/genesis/orb/orb-wake.wav",
];

const missingCritical = criticalAssets.filter((asset) => !fs.existsSync(path.resolve(asset)));
const missingOptional = optionalAssets.filter((asset) => !fs.existsSync(path.resolve(asset)));
const reportPath = path.resolve("launch-proof/public-assets/latest-asset-inventory.json");

if (missingCritical.length) {
  console.error("Missing critical production assets:");
  for (const asset of missingCritical) console.error(`- ${asset}`);
  process.exit(1);
}

if (missingOptional.length) {
  console.warn("Optional assets missing, scene should fail gracefully:");
  for (const asset of missingOptional) console.warn(`- ${asset}`);
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      criticalAssets: criticalAssets.map((asset) => ({
        asset,
        status: fs.existsSync(path.resolve(asset)) ? "present" : "missing",
      })),
      optionalAssets: optionalAssets.map((asset) => ({
        asset,
        status: fs.existsSync(path.resolve(asset)) ? "present" : "optional_missing",
      })),
      claimBoundary:
        "These are launch/demo assets only. Provider-backed private generated media remains gated unless separate production evidence exists.",
    },
    null,
    2,
  )}\n`,
);

console.log(`Verified ${criticalAssets.length} critical asset paths.`);
console.log(`Asset inventory written to ${path.relative(process.cwd(), reportPath)}`);
