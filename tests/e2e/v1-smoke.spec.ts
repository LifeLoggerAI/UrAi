import { expect, test } from "@playwright/test";

async function openHome(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body").getByText(/^Inner Sky Shrine$/)).toBeVisible();
}

async function expectBodyText(page: import("@playwright/test").Page, text: string | RegExp) {
  await expect(page.locator("body").getByText(text)).toBeVisible();
}

test.describe("URAI V1 smoke", () => {
  test("home route renders core V1 sections @smoke", async ({ page }) => {
    await openHome(page);

    await expectBodyText(page, /^URAI$/);
    await expectBodyText(page, /^Sky · Orb · Ground$/);
    await expectBodyText(page, /stable · quiet sky · memory gateway ready/i);
    await expectBodyText(page, /Your sky is quiet, but awake\./i);
  });

  test("final /home field exposes sky, orb, ground, companion, and return-home surfaces @smoke", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Open symbolic life map" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Charge orb" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Wake companion" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tune body field" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open recovery bloom terrain" })).toBeVisible();

    await page.getByRole("button", { name: "Wake companion" }).click({ force: true });
    await expect(page.locator("aside").filter({ hasText: /quiet|listening|reflecting|forecasting|ritual|protective/i })).toBeVisible();

    await page.getByRole("button", { name: "Open life map" }).click({ force: true });
    await expect(page.getByRole("button", { name: "Return home" })).toBeVisible();
  });

  test("final /home reduced-motion path can enter and return from life map @smoke", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/home", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Open symbolic life map" }).click({ force: true });
    await expect(page.getByRole("button", { name: "Return home" })).toBeVisible();

    await page.getByRole("button", { name: "Return home" }).click({ force: true });
    await expect(page.getByRole("button", { name: "Open symbolic life map" })).toBeVisible();
  });

  test("public constellation route renders demo content @smoke", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    await expectBodyText(page, /^Public Constellation$/);
    await expectBodyText(page, /^Demo data · public-safe view$/);
    await expectBodyText(page, /^@adamclamp$/);
    await expectBodyText(page, /^Memory Blooms$/);
    await expectBodyText(page, /^Star Timeline$/);
    await expectBodyText(page, /^Join Early Access$/);
  });

  test("waitlist API accepts an email in dry-run mode @smoke", async ({ request }) => {
    const response = await request.post("/api/waitlist", {
      data: {
        email: "smoke@example.com",
        source: "e2e-smoke",
        handle: "adamclamp",
        intent: "early-access"
      }
    });

    await expect(response).toBeOK();
    const body = await response.json();
    expect(body.ok).toBe(true);
  });

  test("waitlist form keeps invalid email disabled", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    const email = page.locator("#waitlist-email-public-constellation");
    const form = email.locator("xpath=ancestor::form");
    await expect(email).toBeVisible();
    await expect(form.getByRole("button", { name: /Request Access|Joined/ })).toBeDisabled();
  });

  test("companion API responds to a valid prompt", async ({ request }) => {
    const response = await request.post("/api/companion", {
      data: {
        history: [],
        message: "What should I build next?"
      }
    });

    await expect(response).toBeOK();
    const body = await response.json();
    expect(body.reply).toEqual(expect.any(String));
    expect(body.moodTag).toEqual(expect.any(String));
  });

  test("companion blocks empty prompt", async ({ page }) => {
    await openHome(page);

    await expect(page.getByRole("button", { name: "Open URAI orb companion" })).toBeVisible();
  });
});
