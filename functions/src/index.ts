
// Next.js server integration
import * as functions from "firebase-functions";

const dev = process.env.NODE_ENV !== "production";

// Initialize Next.js only when needed
let nextApp: any = null;
let nextHandler: any = null;

const getNextApp = async () => {
  if (!nextApp) {
    const next = require("next");
    nextApp = next({ dev, conf: { distDir: ".next" } });
    await nextApp.prepare();
    nextHandler = nextApp.getRequestHandler();
  }
  return { app: nextApp, handle: nextHandler };
};

export const nextServer = functions.https.onRequest(async (req, res) => {
  try {
    const { handle } = await getNextApp();
    return handle(req, res);
  } catch (error) {
    console.error("Next.js server error:", error);
    res.status(500).send(error instanceof Error ? error.toString() : "Internal server error");
  }
});

/**
 * Import function triggers from their respective submodules:
 *
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Export Genkit flows
export * from "./genkit-sample";

// Export user management triggers
export * from "./user-management";

// Export emotion engine triggers
export * from "./emotion-engine";

// Export torso engine triggers
export * from "./torso-engine";

// Export legs engine triggers
export * from "./legs-engine";

// Export arms engine triggers
export * from "./arms-engine";

// Export orb engine triggers
export * from "./orb-engine";

// Export social engine triggers
export * from "./social-engine";

// Export timeline engine triggers
export * from "./timeline-engine";

// Export data privacy triggers
export * from "./data-privacy";

// Export scheduled functions
export * from "./scheduled";

// Export notification queue
export * from "./notifications";

// Export email engine
export * from "./email-engine";

// Export speech and AI pipeline engine
export * from "./speech-engine";

// Export visuals engine
export * from "./visuals-engine";

// Export new engines
export * from "./telemetry-engine";
export * from "./avatar-engine";
export * from "./dream-engine";
export * from "./symbolic-engine";
