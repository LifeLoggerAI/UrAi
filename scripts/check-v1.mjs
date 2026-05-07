import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "README.md",
  "package.json",
  "env.local.template",
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "tailwind.config.ts",
  "postcss.config.mjs",
  "src/app/page.tsx",
  "src/app/u/[handle]/page.tsx",
  "src/app/api/companion/route.ts",
  "src/app/api/waitlist/route.ts",
  "src/components/HomeScene.tsx",
  "src/components/CompanionChat.tsx",
  "src/components/ForecastCard.tsx",
  "src/components/WeeklyReflectionCard.tsx",
  "src/components/WaitlistForm.tsx",
  "src/lib/companion-engine.ts",
  "src/lib/demo-data.ts",
  "src/lib/firebase-admin.ts",
  "src/lib/urai-v1-schemas.ts",
  "scripts/seed-demo.mjs",
  "docs/API_V1.md",
  "docs/V1_DEPLOY_CHECKLIST.md",
  "docs/V1_QA_CHECKLIST.md",
  "docs/V1_MANUAL_TESTS.md",
  "docs/FIRESTORE_V1_COLLECTIONS.md",
  "docs/LOCKFILE_REFRESH.md"
];

const requiredPackageScripts = [
  "seed:demo",
  "test:unit",
  "check:types",
  "build",
  "preflight"
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

const missingFiles = requiredFiles.filter((file) => !exists(file));
const packageJson = readJson("package.json");
const missingScripts = requiredPackageScripts.filter((script) => !packageJson.scripts?.[script]);
const missingDeps = ["firebase", "firebase-admin", "react", "react-dom"].filter(
  (dep) => !packageJson.dependencies?.[dep]
);
const missingDevDeps = ["tailwindcss", "postcss", "autoprefixer", "typescript", "jest"].filter(
  (dep) => !packageJson.devDependencies?.[dep]
);

const firebaseJson = readJson("firebase.json");
const firebaseProblems = [];
if (firebaseJson.firestore?.rules !== "firestore.rules") firebaseProblems.push("firebase.json firestore.rules must point to firestore.rules");
if (firebaseJson.firestore?.indexes !== "firestore.indexes.json") firebaseProblems.push("firebase.json firestore.indexes must point to firestore.indexes.json");

const problems = [
  ...missingFiles.map((file) => `Missing file: ${file}`),
  ...missingScripts.map((script) => `Missing package script: ${script}`),
  ...missingDeps.map((dep) => `Missing dependency: ${dep}`),
  ...missingDevDeps.map((dep) => `Missing devDependency: ${dep}`),
  ...firebaseProblems
];

if (problems.length) {
  console.error("URAI V1 sanity check failed:\n");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log("URAI V1 sanity check passed.");
console.log(`Checked ${requiredFiles.length} files, ${requiredPackageScripts.length} scripts, Firebase config, and V1 dependencies.`);
