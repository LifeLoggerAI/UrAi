import { expect, test } from "@playwright/test";

async function collectPageProblems(page: import("@playwright/test").Page) {
  const problems: string[] = [];

  page.on("console", (message) => {
    if (["error"].includes(message.type())) {
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
    const problems = await collectPageProblems(page);

    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Own your life\. Step inside yourself\./i })).toBeVisible();
    await expect(page.getByTestId("xr-ready-canvas")).toBeVisible();
    await expect(page.locator("canvas").first()).toBeVisible();
    await expect(page.getByText(/Headset entry appears only when the browser proves support/i)).toBeVisible();
    await expect(page.getByText(/Enter VR is hidden because this browser\/device does not currently report immersive-vr support/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Enter VR$/ })).toHaveCount(0);

    expect(problems).toEqual([]);
  });

  test("/home mobile loads without losing the safe WebXR fallback @smoke", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile project only");

    const problems = await collectPageProblems(page);

    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Own your life\. Step inside yourself\./i })).toBeVisible();
    await expect(page.getByTestId("xr-ready-canvas")).toBeVisible();
    await expect(page.locator("canvas").first()).toBeVisible();
    await expect(page.getByText(/3D Home stays normal until real VR is supported/i)).toBeVisible();

    expect(problems).toEqual([]);
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
