import { expect, test } from "@playwright/test";

async function expectBodyText(page: import("@playwright/test").Page, text: string | RegExp) {
  await expect(page.locator("body")).toContainText(text);
}

const privatePayloadMarkers = [
  /data-(?:private-memory|owner-memory)(?:-id)?=/i,
  /["'](?:privateMemory|ownerMemory|memoryContent|ownerUid)["']\s*:/i,
  /(?:memoryId|ownerUid|ownerId)\s*=\s*["'][^"']+/i,
];

async function expectHtml(request: import("@playwright/test").APIRequestContext, route: string, text: string | RegExp) {
  const response = await request.get(route);
  await expect(response).toBeOK();
  const html = await response.text();
  expect(html).toMatch(text);
  for (const marker of privatePayloadMarkers) expect(html).not.toMatch(marker);
}

test.describe("URAI current release smoke", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "Mobile Chromium is covered separately outside the constrained release gate.");
  });

  test("home shell renders the current spatial threshold @smoke", async ({ page }) => {
    await page.goto("/home", { waitUntil: "networkidle" });

    await expect(page.locator('[data-urai-spatial-universe="mounted"]')).toHaveAttribute("data-urai-mode", "home");
    const homeWorld = page.locator('[aria-label="URAI Home World"]');
    await expect(homeWorld).toBeAttached();
    await expect(homeWorld.locator(".world-shell")).toBeVisible();
    await expectBodyText(page, /Life Map/i);
    await expectBodyText(page, /Replay/i);
    await expectBodyText(page, /Passport/i);
    await expect(page.locator('a[aria-label="Life Map"]').first()).toHaveAttribute("href", "/life-map");
    await expect(page.locator('a[aria-label="Replay"]').first()).toHaveAttribute("href", "/replay");
    await expect(page.locator('a[aria-label="Passport"]').first()).toHaveAttribute("href", "/passport");
  });

  test("core public routes render launch-safe content @smoke", async ({ request }) => {
    const routes = [
      ["/home", /Life Map/i],
      ["/ground", /Ground/i],
      ["/life-map", /Life Map/i],
      ["/xr", /XR/i],
      ["/privacy", /privacy/i],
      ["/terms", /terms/i],
      ["/status", /status/i],
      ["/waitlist", /waitlist/i],
    ] as const;

    for (const [route, expectedText] of routes) {
      await expectHtml(request, route, expectedText);
    }
  });

  test("public constellation route remains public-safe @smoke", async ({ request }) => {
    const response = await request.get("/u/adamclamp");
    await expect(response).toBeOK();
    const html = await response.text();

    expect(html).toMatch(/Public Constellation \| URAI/i);
    expect(html).toMatch(/Public-safe URAI constellation view/i);
    expect(html).toMatch(/public demo/i);
    expect(html).toMatch(/Sample data only/i);
    expect(html).toMatch(/without exposing owner-only memory data/i);
    expect(html).not.toMatch(/private memory/i);
  });

  test("waitlist and status APIs respond safely @smoke", async ({ request }) => {
    const waitlist = await request.post("/api/waitlist", {
      data: {
        email: `release-smoke-${Date.now()}@example.com`,
        source: "release-smoke",
        handle: "adamclamp",
        intent: "release-verification",
      },
    });
    await expect(waitlist).toBeOK();
    const waitlistBody = await waitlist.json();
    expect(waitlistBody.ok).toBe(true);

    const status = await request.get("/api/status");
    await expect(status).toBeOK();
    const statusBody = await status.json();
    expect(statusBody.ok).toBe(true);
    expect(statusBody.service).toBe("urai");
  });
});
