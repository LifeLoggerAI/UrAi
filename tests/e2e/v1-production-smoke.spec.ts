import { expect, test } from "@playwright/test";

test.describe("URAI production smoke", () => {
  test("home route renders production sanctuary shell @production-smoke", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("body").getByText(/^Inner Sky Shrine$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^URAI$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^Sky · Orb · Ground$/).first()).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Open URAI orb companion" })).toBeVisible();
  });

  test("/home exposes core interaction surfaces without mutation @production-smoke", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Open symbolic life map" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Charge orb" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Wake companion" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tune body field" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open recovery bloom terrain" })).toBeVisible();
  });

  test("required spatial routes expose canonical route state @production-smoke", async ({ page }) => {
    await page.goto("/life-map", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='life-map']")).toBeVisible();
    await expect(page.locator("main[data-tier-one='true']")).toBeVisible();
    await expect(page.locator("[data-tier-two-panel='active']")).toBeVisible();
    await expect(page.getByText("Star preview")).toBeVisible();
    await expect(page.getByText("Filters and privacy")).toBeVisible();

    await page.goto("/life-map/star/starter-star", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='star-selected']")).toBeVisible();
    await expect(page.getByText("Selected star: starter-star")).toBeVisible();
    await expect(page.getByText("Starter Star")).toBeVisible();

    await page.goto("/focus", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='life-map']")).toBeVisible();
    await expect(page.getByText("Choose a star before opening focus.")).toBeVisible();

    await page.goto("/focus/session/starter-session", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='focus-session']")).toBeVisible();
    await expect(page.getByText("Focus session: starter-session")).toBeVisible();
    await expect(page.getByText("Focus state")).toBeVisible();

    await page.goto("/replay", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='replay-library']")).toBeVisible();

    await page.goto("/replay/starter-replay", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='replay-detail']")).toBeVisible();
    await expect(page.getByText("Replay: starter-replay")).toBeVisible();
    await expect(page.getByText("Replay state")).toBeVisible();
  });

  test("public constellation route renders public-safe content @production-smoke", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    await expect(page.locator("body").getByText(/^Public Constellation$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^Demo data · public-safe view$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^@adamclamp$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^Join Early Access$/).first()).toBeVisible();
  });

  test("status API returns service status envelope @production-smoke", async ({ request }) => {
    const response = await request.get("/api/status");

    await expect(response).toBeOK();
    const body = await response.json();
    expect(Array.isArray(body.services)).toBe(true);
    expect(body.generatedAt).toEqual(expect.any(String));
    expect(body.services.some((service: { id?: string }) => service.id === "web-app")).toBe(true);
  });
});
