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

  test("waitlist form accepts an email in dry-run mode @smoke", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    await page.getByLabel("Email address").fill("smoke@example.com");
    await page.getByRole("button", { name: "Join" }).click();
    await expectBodyText(page, /^You are on the list\.$/);
  });

  test("waitlist form validates bad email before submitting", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    await page.getByLabel("Email address").fill("not-an-email");
    await expect(page.getByRole("button", { name: "Join" })).toBeDisabled();
  });

  test("companion responds to a valid prompt", async ({ page }) => {
    await openHome(page);

    const input = page.locator("#companion-message");
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
    await input.fill("What should I build next?");
    await input.press("Enter");

    await expectBodyText(page, /Mood:/);
  });

  test("companion blocks empty prompt", async ({ page }) => {
    await openHome(page);

    await expect(page.locator("#companion-message")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});
