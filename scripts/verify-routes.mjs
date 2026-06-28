import fs from "node:fs";

const routes = [
  ["/", "src/app/page.tsx"],
  ["/home", "src/app/home/page.tsx"],
  ["/launch", "src/app/launch/page.tsx"],
  ["/life-map", "src/app/life-map/page.tsx"],
  ["/life-map/star/star-001", "src/app/life-map/star/[starId]/page.tsx"],
  ["/mirror", "src/app/mirror/page.tsx"],
  ["/cognitive-mirror", "src/app/cognitive-mirror/page.tsx"],
  ["/memory/memory-001", "src/app/memory/[id]/page.tsx"],
  ["/replay", "src/app/replay/page.tsx"],
  ["/replay/sample-replay", "src/app/replay/[replayId]/page.tsx"],
  ["/focus", "src/app/focus/page.tsx"],
  ["/focus/session/sample-session", "src/app/focus/session/[sessionId]/page.tsx"],
  ["/orb", "src/app/orb/page.tsx"],
  ["/orb-chat", "src/app/orb-chat/page.tsx"],
  ["/ochat", "src/app/ochat/page.tsx"],
  ["/ground", "src/app/ground/page.tsx"],
  ["/sky", "src/app/sky/page.tsx"],
  ["/horizon", "src/app/horizon/page.tsx"],
  ["/passport", "src/app/passport/page.tsx"],
  ["/status", "src/app/status/page.tsx"],
  ["/demo", "src/app/demo/page.tsx"],
  ["/early-access", "src/app/early-access/page.tsx"],
  ["/onboarding", "src/app/onboarding/page.tsx"],
  ["/studio", "src/app/studio/page.tsx"],
  ["/motion", "src/app/motion/page.tsx"],
  ["/music-video", "src/app/music-video/page.tsx"],
  ["/xr", "src/app/xr/page.tsx"],
  ["/invite/sample", "src/app/invite/[code]/page.tsx"],
  ["/u/adamclamp", "src/app/u/[handle]/page.tsx"],
  ["/waitlist", "src/app/waitlist/page.tsx"],
  ["/privacy", "src/app/privacy/page.tsx"],
  ["/terms", "src/app/terms/page.tsx"],
  ["/support", "src/app/support/page.tsx"],
  ["/system", "src/app/system/page.tsx"],
  ["/admin", "src/app/admin/page.tsx"],
  ["/api/companion/respond", "src/app/api/companion/respond/route.ts"],
  ["/api/waitlist", "src/app/api/waitlist/route.ts"],
  ["/api/admin/status", "src/app/api/admin/status/route.ts"],
];

const uniqueRoutes = Array.from(new Map(routes.map((route) => [route[0], route])).values());
const missing = uniqueRoutes.filter(([, path]) => !fs.existsSync(path));

if (missing.length) {
  console.error("Missing critical URAI routes:");
  for (const [route, path] of missing) console.error(`- ${route}: ${path}`);
  process.exit(1);
}

console.log(`Verified ${uniqueRoutes.length} critical routes.`);
