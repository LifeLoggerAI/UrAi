import { expect, test } from "@playwright/test";

const ORB_COMPANION_BUTTON = "Open URAI orb companion";

async function expectOrbCompanionButton(page: import("@playwright/test").Page) {
  await expect(page.getByRole("button", { name: ORB_COMPANION_BUTTON }).first()).toBeVisible();
}

test.describe("URAI production smoke", () => {
  test("root and /home resolve to the same canonical sanctuary shell @production-smoke", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("body").getByText(/^Inner Sky Shrine$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^URAI$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^Sky · Orb · Ground$/).first()).toHaveCount(1);
    await expectOrbCompanionButton(page);
    await expect(page.locator("body").getByText(/Final Home Field/)).toHaveCount(0);

    await page.goto("/home", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("body").getByText(/^Inner Sky Shrine$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^URAI$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^Sky · Orb · Ground$/).first()).toHaveCount(1);
    await expectOrbCompanionButton(page);
    await expect(page.locator("body").getByText(/Final Home Field/)).toHaveCount(0);
  });

  test("/home exposes canonical core interaction surfaces after redirect @production-smoke", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("body").getByText(/^Inner Sky Shrine$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/^Sky · Orb · Ground$/).first()).toHaveCount(1);
    await expectOrbCompanionButton(page);
    await expect(page.locator("body").getByText(/Final Home Field/)).toHaveCount(0);
  });

  test("orb companion route renders safely and links home @production-smoke", async ({ page }) => {
    await page.goto("/ochat", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("main", { name: "URAI orb companion chamber" })).toBeVisible();
    await expect(page.getByText(/^Orb companion$/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "URAI is here without taking over." })).toBeVisible();
    await expect(page.getByText(/No raw private logs appear here\./)).toBeVisible();
    await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/home");
    await expect(page.getByRole("link", { name: "Open life map" })).toHaveAttribute("href", "/life-map");
  });

  test("required spatial routes expose canonical route state @production-smoke", async ({ page }) => {
    await page.goto("/life-map", { waitUntil: "domcontentloaded" });
    const lifeMap = page.locator("main[data-route-state='life-map']");
    await expect(lifeMap).toBeVisible();
    await expect(page.locator("main[data-tier-one='true']")).toBeVisible();
    await expect(page.locator("main[data-tier-two='true']")).toBeVisible();
    await expect(page.locator("main[data-tier-three='true']")).toBeVisible();
    await expect(page.locator("main[data-tier-four='true']")).toBeVisible();
    await expect(page.locator("[data-tier-two-panel='active']")).toBeVisible();
    await expect(page.locator("[data-tier-three-layer='active']")).toBeVisible();
    await expect(page.locator("[data-tier-four-layer='active']")).toBeVisible();
    await expect(page.locator("[data-performance-budget='tier-3-4']")).toBeVisible();
    await expect(page.getByText("Star preview")).toBeVisible();
    await expect(page.getByText("Filters and privacy")).toBeVisible();
    await expect(page.getByText("Constellation model")).toBeVisible();
    await expect(page.getByText("Artifact unlock review")).toBeVisible();

    await page.goto("/life-map/star/starter-star", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='star-selected']")).toBeVisible();
    await expect(page.locator("aside").getByText("Selected star: starter-star")).toBeVisible();
    await expect(page.getByLabel("URAI spatial stage").getByText("Selected star: starter-star")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Starter Star" })).toBeVisible();

    await page.goto("/focus", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='life-map']")).toBeVisible();
    await expect(page.getByText("Choose a star before opening focus.")).toBeVisible();

    await page.goto("/focus/session/starter-session", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='focus-session']")).toBeVisible();
    await expect(page.getByText("Focus session: starter-session").first()).toBeVisible();
    await expect(page.getByText("Focus state")).toBeVisible();

    await page.goto("/replay", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='replay-library']")).toBeVisible();

    await page.goto("/replay/starter-replay", { waitUntil: "domcontentloaded" });
    const replayDetail = page.locator("main[data-route-state='replay-detail']");
    await expect(replayDetail).toBeVisible();
    await expect(replayDetail.getByText("Replay: starter-replay").first()).toBeVisible();
    await expect(page.getByText("Replay state")).toBeVisible();
    await expect(page.getByText("Starter Replay Arc")).toBeVisible();
  });

  test("route-machine ESC unwind returns to canonical root home @production-smoke", async ({ page }) => {
    await page.goto("/life-map", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main[data-route-state='life-map']")).toBeVisible();
    await page.keyboard.press("Escape");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body").getByText(/^Inner Sky Shrine$/).first()).toBeVisible();
    await expect(page.locator("body").getByText(/Final Home Field/)).toHaveCount(0);
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
