import fs from "node:fs";

const routes = [
  ["/", "src/app/page.tsx"],
  ["/demo", "src/app/demo/page.tsx"],
  ["/u/adamclamp", "src/app/u/[handle]/page.tsx"],
  ["/launch", "src/app/launch/page.tsx"],
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
