import { expect, test } from "@playwright/test";

test("admin route is private when signed out", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText(/This area is private/i)).toBeVisible();
});

test("public demo does not expose admin links", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("link", { name: /admin/i })).toHaveCount(0);
  await expect(page.getByText(/URAI Admin/i)).toHaveCount(0);
});

test("admin API foundation is not public", async ({ request }) => {
  const status = await request.get("/api/admin/status");
  expect(status.status()).toBe(403);
  const csv = await request.get("/api/admin/waitlist/export");
  expect(csv.status()).toBe(403);
});
