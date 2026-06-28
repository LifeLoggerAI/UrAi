import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const proofDir = process.env.HOME_XR_PROOF_DIR ?? "/tmp/urai-playwright-results/home-xr-proof";

function ensureProofDir() {
  fs.mkdirSync(proofDir, { recursive: true });
}

function collectPageProblems(page: import("@playwright/test").Page) {
  const problems: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      problems.push(`console ${message.type()}: ${message.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    problems.push(`pageerror: ${error.message}`);
  });

  return problems;
}

test.describe("Home WebXR interaction smoke", () => {
  test("/home desktop loads with truthful XR gate and canvas @smoke", async ({ page }) => {
    ensureProofDir();
    const problems = collectPageProblems(page);

    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Own your life\. Step inside yourself\./i })).toBeVisible();
    await expect(page.getByTestId("xr-ready-canvas")).toBeVisible();
    await expect(page.locator("canvas").first()).toBeVisible();
    await expect(page.getByText(/Headset entry appears only when the browser proves support/i)).toBeVisible();
    await expect(page.getByText(/WebXR foundation/i)).toBeVisible();
    await expect(page.getByText(/3D Home stays normal until real VR is supported/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Enter VR$/ })).toHaveCount(0);

    await page.screenshot({ path: path.join(proofDir, "home-desktop.png"), fullPage: true });
    expect(problems).toEqual([]);
  });

  test("/home mobile loads without losing the safe WebXR fallback @smoke", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile project only");

    ensureProofDir();
    const problems = collectPageProblems(page);

    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Own your life\. Step inside yourself\./i })).toBeVisible();
    await expect(page.getByTestId("xr-ready-canvas")).toBeVisible();
    await expect(page.locator("canvas").first()).toBeVisible();
    await expect(page.getByText(/3D Home stays normal until real VR is supported/i)).toBeVisible();

    await page.screenshot({ path: path.join(proofDir, "home-mobile.png"), fullPage: true });
    expect(problems).toEqual([]);
  });

  test("/home shows real XR affordance only when immersive-vr is mocked supported @smoke", async ({ page }) => {
    ensureProofDir();

    await page.addInitScript(() => {
      Object.defineProperty(navigator, "xr", {
        configurable: true,
        value: {
          isSessionSupported: async (mode: string) => mode === "immersive-vr",
          requestSession: async () => ({
            addEventListener: () => undefined,
          }),
        },
      });
    });

    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("xr-ready-canvas")).toBeVisible();
    await expect(page.locator("canvas").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /^Enter VR$/ })).toBeVisible();

    await page.screenshot({ path: path.join(proofDir, "home-xr-affordance-mocked.png"), fullPage: true });
  });

  test("/home keeps real route navigation targets available outside XR @smoke", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: "Ground" }).first()).toHaveAttribute("href", "/ground");
    await expect(page.getByRole("link", { name: "Life Map" }).first()).toHaveAttribute("href", "/life-map");
    await expect(page.getByRole("link", { name: "Replay" }).first()).toHaveAttribute("href", "/replay");
    await expect(page.getByRole("link", { name: "Mirror" }).first()).toHaveAttribute("href", "/mirror");
    await expect(page.getByRole("link", { name: "XR" }).first()).toHaveAttribute("href", "/xr");
  });
});
