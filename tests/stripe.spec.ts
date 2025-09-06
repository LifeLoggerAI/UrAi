import { test, expect } from '@playwright/test';

test('pricing page shows upgrade button', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByRole('button', { name: /upgrade/i })).toBeVisible();
});
