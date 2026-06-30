import { expect, test } from "@playwright/test";

async function expectBodyText(page: import("@playwright/test").Page, text: string | RegExp) {
  await expect(page.locator("body")).toContainText(text);
}

async function expectHtml(request: import("@playwright/test").APIRequestContext, route: string, text: string | RegExp) {
  const response = await request.get(route);
  await expect(response).toBeOK();
  const html = await response.text();
  expect(html).toMatch(text);
  expect(html).not.toMatch(/private memory/i);
}

test.describe("URAI current release smoke", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "Mobile Chromium is covered separately outside the constrained release gate.");
  });

  test("home shell renders the current spatial threshold @smoke", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expectBodyText(page, /Own your life/i);
    await expectBodyText(page, /Home threshold/i);
    await expectBodyText(page, /Life Map galaxy/i);
    await expect(page.getByRole("link", { name: /Step inside Ground/i })).toHaveAttribute("href", "/ground");
    await expect(page.getByRole("link", { name: /Open Life Map preview/i })).toHaveAttribute("href", "/life-map");
    await expect(page.getByRole("link", { name: /Check XR support/i })).toHaveAttribute("href", "/xr");
  });

  test("core public routes render launch-safe content @smoke", async ({ request }) => {
    const routes = [
      ["/home", /Own your life/i],
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
    expect(html).not.toMatch(/owner-only memory data/i);
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
