import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const proofDir = process.env.LIFE_MAP_XR_PROOF_DIR ?? "/tmp/urai-playwright-results/life-map-xr-proof";

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

test.describe("Life Map Quest interaction smoke", () => {
  test("/life-map desktop loads the existing scene canvas and non-XR fallback UI @smoke", async ({ page }) => {
    ensureProofDir();
    const problems = collectPageProblems(page);

    await page.goto("/life-map", { waitUntil: "domcontentloaded" });

    await expect(page.locator("main.spatial-life-map")).toBeVisible();
    await expect(page.locator(".spatial-stage")).toBeVisible();
    await expect(page.locator("canvas.spatial-canvas")).toHaveCount(1);
    await expect(page.getByText(/Life Map galaxy/i)).toBeVisible();
    await expect(page.getByText(/stars awake/i)).toBeVisible();

    await page.screenshot({ path: path.join(proofDir, "life-map-desktop.png"), fullPage: true });
    expect(problems).toEqual([]);
  });

  test("/life-map mobile loads without blank canvas or route crash @smoke", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile project only");

    ensureProofDir();
    const problems = collectPageProblems(page);

    await page.goto("/life-map", { waitUntil: "domcontentloaded" });

    await expect(page.locator("main.spatial-life-map")).toBeVisible();
    await expect(page.locator("canvas.spatial-canvas")).toHaveCount(1);
    await expect(page.getByText(/Life Map galaxy/i)).toBeVisible();

    await page.screenshot({ path: path.join(proofDir, "life-map-mobile.png"), fullPage: true });
    expect(problems).toEqual([]);
  });

  test("/life-map keeps DOM navigation usable outside XR @smoke", async ({ page }) => {
    await page.goto("/life-map", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "HOME" })).toBeVisible();
    await expect(page.getByRole("button", { name: "LIFE MAP" })).toBeVisible();
    await expect(page.getByRole("button", { name: "REPLAY" })).toBeVisible();
    await expect(page.getByRole("button", { name: "PASSPORT" })).toBeVisible();
  });
});
