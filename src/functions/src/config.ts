
export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://urai.app",
  "https://www.urai.app",
  "https://geturai.app",
  "http://localhost:8080",
  "http://127.0.0.1:8080"
];

// In prod, set true; in local dev you can flip to false.
export const REQUIRE_ADMIN_TOKEN = process.env.FUNCTIONS_EMULATOR ? false : true;
