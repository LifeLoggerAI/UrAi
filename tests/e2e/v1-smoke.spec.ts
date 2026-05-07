import { expect, test } from "@playwright/test";

test.describe("URAI V1 smoke", () => {
  test("home route renders core V1 sections @smoke", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("URAI V1 Demo Spine")).toBeVisible();
    await expect(page.getByText("Mood Forecast")).toBeVisible();
    await expect(page.getByText("Weekly Reflection")).toBeVisible();
    await expect(page.getByText("Companion")).toBeVisible();
    await expect(page.getByText("Early Access")).toBeVisible();
  });

  test("public constellation route renders demo content @smoke", async ({ page }) => {
    await page.goto("/u/adamclamp");

    await expect(page.getByText("Public Constellation")).toBeVisible();
    await expect(page.getByText("@adamclamp")).toBeVisible();
    await expect(page.getByText("Memory Blooms")).toBeVisible();
    await expect(page.getByText("Star Timeline")).toBeVisible();
    await expect(page.getByText("Join the URAI waitlist")).toBeVisible();
  });

  test("waitlist form accepts an email in dry-run mode @smoke", async ({ page }) => {
    await page.goto("/u/adamclamp");

    await page.getByLabel("Email address").fill("smoke@example.com");
    await page.getByRole("button", { name: "Join" }).click();
    await expect(page.getByText("You are on the list.")).toBeVisible();
  });

  test("waitlist form validates bad email before submitting", async ({ page }) => {
    await page.goto("/u/adamclamp");

    await page.getByLabel("Email address").fill("not-an-email");
    await expect(page.getByRole("button", { name: "Join" })).toBeDisabled();
  });

  test("companion responds to a valid prompt", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Message URAI Companion").fill("What should I build next?");
    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText(/Mood:/)).toBeVisible();
  });

  test("companion blocks empty prompt", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});
