const functions = require("firebase-functions");

const dev = process.env.NODE_ENV !== "production";

// Initialize Next.js only when needed
let nextApp = null;
let nextHandler = null;

const getNextApp = async () => {
  if (!nextApp) {
    const next = require("next");
    nextApp = next({ dev, conf: { distDir: ".next" } });
    await nextApp.prepare();
    nextHandler = nextApp.getRequestHandler();
  }
  return { app: nextApp, handle: nextHandler };
};

exports.nextServer = functions.https.onRequest(async (req, res) => {
  try {
    const { handle } = await getNextApp();
    return handle(req, res);
  } catch (error) {
    console.error("Next.js server error:", error);
    res.status(500).send(error instanceof Error ? error.toString() : "Internal server error");
  }
});