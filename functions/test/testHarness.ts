import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const configBase64 = process.env.FIREBASE_ADMIN_SDK_CONFIG_BASE64;
  if (!configBase64) throw new Error("Missing FIREBASE_ADMIN_SDK_CONFIG_BASE64");

  const serviceAccount = JSON.parse(
    Buffer.from(configBase64, "base64").toString("utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Replace this with your actual function
import { generateWeeklyScroll } from "../src/generateWeeklyScroll";

(async () => {
  // Create mock callable context
  const mockContext: functions.https.CallableContext = {
    auth: {
      uid: "test-user",
      token: {}
    },
    app: undefined,
    instanceIdToken: undefined,
    rawRequest: {} as any
  };

  const result = await generateWeeklyScroll({ test: true }, mockContext);
  console.log("✅ Function result:", result);
})();