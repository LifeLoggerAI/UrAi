import fs from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "tmp");
const outputPath = path.join(outputDir, "waitlist-export.csv");
const hasAdminEnv = Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);

function csvEscape(value) {
  if (value === undefined || value === null) return "";
  const text = String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  const headers = ["email", "source", "handle", "intent", "status", "createdAt", "updatedAt", "lastSource", "lastHandle", "lastIntent"];
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
}

async function loadRows() {
  if (!hasAdminEnv) {
    console.warn("Firebase Admin env vars missing. Exporting sample dry-run row only.");
    return [
      {
        email: "sample@example.com",
        source: "dry-run",
        handle: "adamclamp",
        intent: "early-access",
        status: "joined",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  const { cert, getApps, initializeApp } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: String(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n")
      })
    });
  }

  const snapshot = await getFirestore().collection("waitlistSignups").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

const rows = await loadRows();
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, toCsv(rows));
console.log(`Exported ${rows.length} waitlist rows to ${outputPath}`);
