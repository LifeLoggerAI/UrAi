import { expect, test } from "@playwright/test";

async function openHome(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body").getByText(/^URAI V1 Demo Spine$/)).toBeVisible();
}

async function expectBodyText(page: import("@playwright/test").Page, text: string | RegExp) {
  await expect(page.locator("body").getByText(text)).toBeVisible();
}

test.describe("URAI V1 smoke", () => {
  test("home route renders core V1 sections @smoke", async ({ page }) => {
    await openHome(page);

    await expectBodyText(page, /^Mood Forecast$/);
    await expectBodyText(page, /^Weekly Reflection$/);
    await expectBodyText(page, /^Companion$/);
    await expectBodyText(page, /^Early Access$/);
  });

  test("public constellation route renders demo content @smoke", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    await expectBodyText(page, /^Public Constellation$/);
    await expectBodyText(page, /^@adamclamp$/);
    await expectBodyText(page, /^Memory Blooms$/);
    await expectBodyText(page, /^Star Timeline$/);
    await expectBodyText(page, /^Join the URAI waitlist$/);
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
    await expect(form.getByRole("button", { name: "Join" })).toBeDisabled();
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

    const input = page.locator("#companion-message");
    const form = input.locator("xpath=ancestor::form");
    await expect(input).toBeVisible();
    await expect(form.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});
