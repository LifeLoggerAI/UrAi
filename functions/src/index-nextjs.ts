// Temporary minimal index.ts for testing Next.js integration
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