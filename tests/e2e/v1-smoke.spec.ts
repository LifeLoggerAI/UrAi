import { expect, test } from "@playwright/test";

async function openHome(page: import("@playwright/test").Page) {
  await page.goto("/");
  await expect(page.getByText("URAI V1 Demo Spine", { exact: true })).toBeVisible();
}

test.describe("URAI V1 smoke", () => {
  test("home route renders core V1 sections @smoke", async ({ page }) => {
    await openHome(page);

    await expect(page.getByText("Mood Forecast", { exact: true })).toBeVisible();
    await expect(page.getByText("Weekly Reflection", { exact: true })).toBeVisible();
    await expect(page.getByText("Companion", { exact: true })).toBeVisible();
    await expect(page.getByText("Early Access", { exact: true })).toBeVisible();
  });

  test("public constellation route renders demo content @smoke", async ({ page }) => {
    await page.goto("/u/adamclamp");

    await expect(page.getByText("Public Constellation", { exact: true })).toBeVisible();
    await expect(page.getByText("@adamclamp", { exact: true })).toBeVisible();
    await expect(page.getByText("Memory Blooms", { exact: true })).toBeVisible();
    await expect(page.getByText("Star Timeline", { exact: true })).toBeVisible();
    await expect(page.getByText("Join the URAI waitlist", { exact: true })).toBeVisible();
  });

  test("waitlist form accepts an email in dry-run mode @smoke", async ({ page }) => {
    await page.goto("/u/adamclamp");

    await page.getByLabel("Email address").fill("smoke@example.com");
    await page.getByRole("button", { name: "Join" }).click();
    await expect(page.getByText("You are on the list.", { exact: true })).toBeVisible();
  });

  test("waitlist form validates bad email before submitting", async ({ page }) => {
    await page.goto("/u/adamclamp");

    await page.getByLabel("Email address").fill("not-an-email");
    await expect(page.getByRole("button", { name: "Join" })).toBeDisabled();
  });

  test("companion responds to a valid prompt", async ({ page }) => {
    await openHome(page);

    const input = page.getByLabel("Message URAI Companion");
    await expect(input).toBeVisible();
    await input.fill("What should I build next?");

    const sendButton = page.getByRole("button", { name: "Send" });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    await expect(page.getByText(/Mood:/)).toBeVisible();
  });

  test("companion blocks empty prompt", async ({ page }) => {
    await openHome(page);

    await expect(page.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});
