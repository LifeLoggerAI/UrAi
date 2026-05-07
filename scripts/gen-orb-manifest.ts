import fs from "fs";
import path from "path";
const orbDir = path.resolve(__dirname, "../public/assets/orb/");
const manifestPath = path.resolve(__dirname, "../public/assets/fallback_orb_manifest.json");
const orbStates = ["neutral","shadow","healing","threshold","rest","energy","voice","notify","forecast","select"];
const manifest = {};
orbStates.forEach(state => {const filename = `fallback-orb-${state}-01.png`;const filePath = path.join(orbDir, filename);if (fs.existsSync(filePath)) {manifest[state] = `/assets/orb/${filename}`;}});
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log("Orb manifest generated:", manifestPath);