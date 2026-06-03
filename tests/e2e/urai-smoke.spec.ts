import { expect, test } from "@playwright/test";

test("@smoke public demo flow stays sample-only", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText(/Sample Demo/i)).toBeVisible();
  await page.getByRole("button", { name: /Enter demo/i }).click();
  await expect(page.getByLabel(/Open URAI Passport/i)).toBeVisible();
  await page.getByLabel(/Open URAI Passport/i).click();
  await expect(page.getByText(/Passport|private|permission/i)).toBeVisible();
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.getByLabel(/Open URAI Companion/i).click();
  await page.getByLabel(/Message URAI/i).fill("What can you see about me?");
  await page.getByRole("button", { name: /Send/i }).click();
  await expect(page.getByText(/sample data|Passport|private/i)).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByLabel(/Open Life Map/i).click();
  await expect(page.getByText(/Life Map|Galaxy|sample/i)).toBeVisible();
});
