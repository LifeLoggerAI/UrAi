import fs from "node:fs";

const routes = [
  ["/", "src/app/page.tsx"],
  ["/home", "src/app/home/page.tsx"],
  ["/launch", "src/app/launch/page.tsx"],
  ["/demo", "src/app/demo/page.tsx"],
  ["/early-access", "src/app/early-access/page.tsx"],
  ["/login", "src/app/login/page.tsx"],
  ["/life-map", "src/app/life-map/page.tsx"],
  ["/mirror", "src/app/mirror/page.tsx"],
  ["/orb-chat", "src/app/orb-chat/page.tsx"],
  ["/ground", "src/app/ground/page.tsx"],
  ["/sky", "src/app/sky/page.tsx"],
  ["/horizon", "src/app/horizon/page.tsx"],
  ["/passport", "src/app/passport/page.tsx"],
  ["/status", "src/app/status/page.tsx"],
  ["/xr", "src/app/xr/page.tsx"],
  ["/u/adamclamp", "src/app/u/[handle]/page.tsx"],
  ["/admin", "src/app/admin/page.tsx"],
  ["/api/companion/respond", "src/app/api/companion/respond/route.ts"],
  ["/api/waitlist", "src/app/api/waitlist/route.ts"],
  ["/api/admin/status", "src/app/api/admin/status/route.ts"],
];

const missing = routes.filter(([, path]) => !fs.existsSync(path));

if (missing.length) {
  console.error("Missing critical URAI routes:");
  for (const [route, path] of missing) console.error(`- ${route}: ${path}`);
  process.exit(1);
}

console.log(`Verified ${routes.length} critical routes.`);
