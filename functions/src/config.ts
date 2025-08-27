
const IS_EMULATOR = process.env.FUNCTIONS_EMULATOR === "true";

// Local dev: allow localhost origins; Prod: your real domains
export const ALLOWED_ORIGINS = IS_EMULATOR
  ? ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"]
  : ["https://urai.app", "https://www.urai.app", "https://geturai.app"];

// Require admin token only in prod
export const REQUIRE_ADMIN_TOKEN = !IS_EMULATOR;
