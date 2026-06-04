import fs from "node:fs";

const checks = [
  ["Passport Shadow off", "src/lib/passport/passportContextTypes.ts", "allowShadowCloudSync: false"],
  ["Passport Legacy off", "src/lib/passport/passportContextTypes.ts", "allowLegacyCloudSync: false"],
  ["Passport Export off", "src/lib/passport/passportContextTypes.ts", "allowExportMetadataCloudSync: false"],
  ["Companion memory off", "src/lib/passport/passportContextTypes.ts", "allowCompanionSessionMemory: false"],
  ["Companion cloud sync off", "src/lib/passport/passportContextTypes.ts", "allowCompanionCloudSync: false"],
  ["Feature Shadow off", "src/lib/admin/featureFlags.ts", "shadow_enabled"],
  ["Feature Legacy off", "src/lib/admin/featureFlags.ts", "legacy_enabled"],
  ["Feature Exports off", "src/lib/admin/featureFlags.ts", "exports_enabled"],
  ["Feature Notifications off", "src/lib/admin/featureFlags.ts", "notifications_enabled"],
  ["Voice off", "src/lib/voice/uraiVoiceEngine.ts", "voiceEnabled: false"],
  ["Audio off", "src/lib/audio/uraiAudioEngine.ts", "enabled: false"],
];

const failures = [];
for (const [label, file, needle] of checks) {
  if (!fs.existsSync(file)) failures.push(`${label}: missing ${file}`);
  else if (!fs.readFileSync(file, "utf8").includes(needle)) failures.push(`${label}: missing ${needle}`);
}

const flagSource = fs.existsSync("src/lib/admin/featureFlags.ts") ? fs.readFileSync("src/lib/admin/featureFlags.ts", "utf8") : "";
for (const id of ["shadow_enabled", "legacy_enabled", "exports_enabled", "notifications_enabled", "cloud_sync_enabled"]) {
  const index = flagSource.indexOf(id);
  const slice = index >= 0 ? flagSource.slice(index, index + 360) : "";
  if (!slice.includes("defaultEnabled: false") || !slice.includes("safetyCritical: true")) failures.push(`${id}: must default off and be safety critical`);
}

if (failures.length) {
  console.error("Privacy default verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Privacy defaults verified: sensitive layers remain closed by default.");
