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
    await page.route("**/api/waitlist", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true })
      });
    });

    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    const waitlist = page.locator("section").filter({ hasText: "Join the URAI waitlist" });
    const email = waitlist.getByPlaceholder("you@example.com");
    const joinButton = waitlist.getByRole("button", { name: "Join" });

    await expect(email).toBeVisible();
    await expect(joinButton).toBeDisabled();
    await email.pressSequentially("smoke@example.com");
    await expect(joinButton).toBeEnabled();
    await joinButton.click();
    await expectBodyText(page, /^You are on the list\.$/);
  });

  test("waitlist form validates bad email before submitting", async ({ page }) => {
    await page.goto("/u/adamclamp", { waitUntil: "domcontentloaded" });

    const waitlist = page.locator("section").filter({ hasText: "Join the URAI waitlist" });
    await waitlist.getByPlaceholder("you@example.com").pressSequentially("not-an-email");
    await expect(waitlist.getByRole("button", { name: "Join" })).toBeDisabled();
  });

  test("companion responds to a valid prompt", async ({ page }) => {
    await page.route("**/api/companion", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reply: "Build the smallest useful loop, then test it with one real person.",
          moodTag: "focused"
        })
      });
    });

    await openHome(page);

    const companion = page.locator("section").filter({ hasText: "Ask URAI what the pattern means" });
    const input = companion.locator("#companion-message");
    const sendButton = companion.getByRole("button", { name: "Send" });

    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
    await expect(sendButton).toBeDisabled();
    await input.pressSequentially("What should I build next?");
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    await expectBodyText(page, /^Mood: focused$/);
  });

  test("companion blocks empty prompt", async ({ page }) => {
    await openHome(page);

    const companion = page.locator("section").filter({ hasText: "Ask URAI what the pattern means" });
    await expect(companion.locator("#companion-message")).toBeVisible();
    await expect(companion.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});
